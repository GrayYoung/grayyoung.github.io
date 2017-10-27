/**
 * Marching gulpfiles.js
 * 
 */

'use strict';


var path = require('path'), fs = require('graceful-fs'), 
	argv = require('yargs').argv, requirejs = require('requirejs'), mergeStream = require('merge-stream'), 
	gulp = require('gulp'), $ = require('gulp-load-plugins')();

var staticMap = JSON.parse(fs.readFileSync('./gulpfile.map', 'utf8'));
/* A parameter to control optimization. */

var optimized = typeof argv.debug === 'undefined', whichWar = typeof argv.war === 'undefined' ? 0 : argv.war;

var paths = {
	source: {
		stc: argv.SRC_DOCROOT || staticMap[whichWar].SRC_DOCROOT,
		war: argv.SRC_WARROOT || staticMap[whichWar].SRC_WARROOT
	},
	dest: {
		stc: argv.DIST_DOCROOT || staticMap[whichWar].DIST_DOCROOT,
		war: argv.DIST_WARROOT || staticMap[whichWar].DIST_WARROOT
	},
	bowerLib : 'bower_components',
	styles: 'css',
	scripts: 'js',
	lib: 'lib',
	images: 'images',
	fonts: 'fonts'
};

var sourcesPaths = {
	styles: {
		base: [path.join(paths.source.stc, paths.styles, '**', '*.css')],
		sass : path.join(paths.source.stc, paths.styles, '**', '*.{sass,scss}')
	},
	scripts: {
		base: path.join(paths.source.stc, paths.scripts, '**', '*.{js,map}')
	},
	images: {
		base: path.join(paths.source.stc, paths.images, '**', '*.{png,gif,jpg,ico}')
	},
	fonts: {
		base: path.join(paths.source.stc, paths.fonts, '**', '*.{eot,svg,ttf,woff,woff2,otf}')
	},
	war: path.join(paths.source.war, '**', '*'),
	other: {
		base: path.join(paths.source.stc, '**', '*.{html,pdf,txt}')
	}
}, targetPaths = {
	styles: path.join(paths.dest.stc, paths.styles),
	scripts: path.join(paths.dest.stc, paths.scripts),
	images: path.join(paths.dest.stc, paths.images),
	fonts: path.join(paths.dest.stc, paths.fonts),
	other: path.join(paths.dest.stc)
};

function processCSS(glob) {
	return gulp.src(glob, {
		base: path.join(paths.source.stc, paths.styles)
	}).pipe($.cleanCss({
		advanced: false,
		aggressiveMerging: false,
		keepSpecialComments: 0,
		mediaMerging: optimized,
		processImport: optimized
	}, function(error, minified) {
		if(error.errors.length > 0) {
			console.log('< minified: ' + minified + ' >');
			console.log(error);
		}
	})).pipe(gulp.dest(targetPaths.styles)).pipe($.size({
		title: '-> CSS',
		showFiles: true
	}));
}

function processSASS(glob) {
	var insert = require('gulp-insert');

	return gulp.src(glob, {
		base: path.join(paths.source.stc, paths.styles)
	}).pipe(insert.prepend('$build-version: ' + argv.buildVersion + ';')).pipe($.sass({
		outputStyle: optimized ? 'compressed' : 'expanded',
		precision: 8
	})).pipe(gulp.dest(targetPaths.styles)).pipe($.size({
		title: '-> SASS',
		showFiles: true
	}));
}

gulp.task('update-bower', function() {
	return $.bower({
		analytics : false,
		cmd : 'update',
		directory : paths.bowerLib
	});
});

gulp.task('update-lib', ['update-bower'], function() {
	var mainStream = mergeStream(), bowerMap = JSON.parse(fs.readFileSync('./bower.map', 'utf8')), property = null;

	function flushPipes(stream, pipes, dir) {
		if(pipes.indexOf(whichWar) > -1) {
			stream.pipe(gulp.dest(path.join(staticMap[whichWar].SRC_DOCROOT, dir, property.dest.join('/'))));
		}

		return stream;
	}

	for(var i in bowerMap) {
		property = bowerMap[i];
		switch(property.type) {
			case 'font':
				mainStream.add(flushPipes(gulp.src(path.join(paths.bowerLib, property.src.join('/'))), property.pipes, paths.fonts).pipe($.size({
					title: '-> ' + i
				})));
				break;
			case 'style':
				mainStream.add(flushPipes(gulp.src(path.join(paths.bowerLib, property.src.join('/'))), property.pipes, paths.styles).pipe($.size({
					title: '-> ' + i
				})));
				break;
			case 'script':
				mainStream.add(flushPipes(gulp.src(path.join(paths.bowerLib, property.src.join('/'))), property.pipes, paths.scripts).pipe($.size({
					title: '-> ' + i
				})));
				break;
		}
	}

	return mainStream;
});

gulp.task('css', function() {
	return processCSS(sourcesPaths.styles.base);
});

gulp.task('sass', function() {
	return processSASS(sourcesPaths.styles.sass);
});

gulp.task('styles', function() {
	return gulp.start(['css', 'sass']);
});

gulp.task('scripts', function() {
	return optimized ? requirejs.optimize({
		allowSourceOverwrites: true,
		appDir: paths.source.stc + '/' + paths.scripts,
		baseUrl: paths.lib,
		dir: paths.dest.stc + '/' + paths.scripts,
		mainConfigFile : paths.source.stc + '/' + paths.scripts + '/config.js',
		keepBuildDir: true,
		throwWhen: {
			optimize : true
		},
		preserveLicenseComments: false
	}, function(buildResponse) {
		/* To get the optimized file contents. */
		/* var contents = fs.readFileSync(config.out, 'utf8'); */
		console.log('-> All scripts are optimized.');
	}) : gulp.src(sourcesPaths.scripts.base).pipe($.jshint({
		/* Visit http://www.jshint.com/docs/options/ to lookup detail */
		/* Enforcing */
		bitwise: false,
		camelcase: false,
		curly: true,
		eqeqeq: false,
		es3: false,
		forin: false,
		freeze: false,
		immed: true,
		indent: 4,
		latedef: true,
		laxbreak: true,
		lookup: false,
		newcap: true,
		noarg: false,
		noempty: true,
		nonbsp: true,
		nonew: true,
		plusplus: false,
		undef: true,
		unused: false,
		strict: false,
		maxparams: 5,
		maxdepth: 5,
		maxstatements : 10,
		maxcomplexity : 5,
		maxlen: 200,
		/* Environments */
		browser : true,
		devel: true,
		jquery : true,
		node : false
	}))/* .pipe($.jshint.reporter(require('jshint-stylish'))) */.pipe(gulp.dest(targetPaths.scripts)).pipe($.size({
		title: '-> Scripts unoptimized'
	}));
});

gulp.task('images', function() {
	return gulp.src(sourcesPaths.images.base).pipe(gulp.dest(targetPaths.images)).pipe($.size({
		title : '-> Images'
	}));
});

gulp.task('fonts', function() {
	return gulp.src(sourcesPaths.fonts.base).pipe(gulp.dest(targetPaths.fonts)).pipe($.size({
		title : '-> Fonts'
	}));
});

gulp.task('war', function() {
	return gulp.src(sourcesPaths.war).pipe(gulp.dest(paths.dest.war)).pipe($.size({
		title : '-> War'
	}));
});

gulp.task('other', function() {
	return gulp.src(sourcesPaths.other.base).pipe(gulp.dest(targetPaths.other)).pipe($.size({
		title : '-> Other'
	}));
});

gulp.task('clean', function() {
	return gulp.src([path.join(paths.dest.stc, '*'), path.join(paths.dest.war, '*')], {
		read : false
	}).pipe($.clean({
		force : true
	}));
});

gulp.task('watch', function(next) {
	$.watch(sourcesPaths.styles.base, function(vinyl) {
		 processCSS(vinyl.path);
	});
	gulp.watch(sourcesPaths.styles.sass, ['sass']);
	if(optimized) {
		gulp.watch(sourcesPaths.scripts.base, ['scripts']);
	} else {
		$.watch(sourcesPaths.scripts.base, function(vinyl) {
			 gulp.src(vinyl.path, {
				base: path.join(paths.source.stc, paths.scripts)
			}).pipe(gulp.dest(targetPaths.scripts)).pipe($.size({
				title : '-> Script',
				showFiles: true
			}));
		});
	}
	$.watch(sourcesPaths.images.base, function(vinyl) {
		 gulp.src(vinyl.path, {
			base: path.join(paths.source.stc, paths.images)
		}).pipe(gulp.dest(targetPaths.images)).pipe($.size({
			title : '-> Image',
			showFiles: true
		}));
	});
	$.watch(sourcesPaths.fonts.base, function(vinyl) {
		 gulp.src(vinyl.path, {
			base: path.join(paths.source.stc, paths.fonts)
		}).pipe(gulp.dest(targetPaths.fonts)).pipe($.size({
			title : '-> Font',
			showFiles: true
		}));
	});
	$.watch(path.join(paths.source.war, '**', '*.{jsp,tag,MF,jar,xml}'), function(vinyl) {
		 gulp.src(vinyl.path, {
			base: paths.source.war
		}).pipe(gulp.dest(paths.dest.war)).pipe($.size({
			title : '-> Fragment',
			showFiles: true
		}));
	});
	$.watch(sourcesPaths.other.base, function(vinyl) {
		 gulp.src(vinyl.path, {
			base: paths.source.stc
		}).pipe(gulp.dest(targetPaths.other)).pipe($.size({
			title : '-> Other',
			showFiles: true
		}));
	});
	gulp.watch(['./bower.json', './bower.map'], ['update-lib']);
});

// DEFAULT GULP TASK
gulp.task('default', ['clean'], function() {
	gulp.start(['images', 'fonts', 'styles', 'scripts']);
});