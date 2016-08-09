/**
 * Marching gulpfiles.js
 * 
 */

'use strict';

var path = require('path');
var argv = require('yargs').argv;
var fs = require('graceful-fs');
var requirejs = require('requirejs');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var gulpfileMap = JSON.parse(fs.readFileSync('./gulpfile.map', 'utf8'))
/* A parameter to control optimization. */
var optimized = true;

var formats = {
	script : '*.{js,map}',
	style : '*.css',
	font : '*.{eot,svg,ttf,woff,woff2,otf}',
	image : '*.{png,gif,jpg,ico}'
};

var paths = {
	sources: {
		stc: argv.SRC_DOCROOT || gulpfileMap.SRC_DOCROOT,
		war: argv.SRC_WARROOT || gulpfileMap.SRC_WARROOT
	},
	target: {
		stc: argv.DIST_DOCROOT || gulpfileMap.DIST_DOCROOT,
		war: argv.DIST_WARROOT || gulpfileMap.DIST_WARROOT
	},
	bowerLib : 'bower_components',
	styles: 'css',
	scripts: 'js',
	lib: 'lib',
	images: 'images',
	fonts: 'fonts',
	html: '**/*.{html,pdf,txt}',
	exclude: [ '!*/**/{build,demos,test,docs,versions,source/dev,source/jquery}/**/*' ],
	exBootstrap: '!*/**/bootstrap/**/*'
};

var sourcesPaths = {
	styles: {
		base: [path.join(paths.sources.stc, paths.styles, '**', formats.style), '!' + path.join(paths.sources.stc, paths.styles, 'web', 'interior_style.css')],
		sass : path.join(paths.sources.stc, paths.styles, '**', '*.{sass,scss}')
	},
	scripts: {
		base: path.join(paths.sources.stc, paths.scripts, '**', formats.script)
	},
	images: {
		base: path.join(paths.sources.stc, paths.images, '**', formats.image)
	},
	fonts: {
		base: path.join(paths.sources.stc, paths.fonts, '**', formats.font)
	},
	html: {
		base: path.join(paths.sources.stc, paths.html)
	},
	war: [path.join(paths.sources.war, '{WEB-INF,META-INF}', '**', '*'), path.join(paths.sources.war, '**', '*.{html,jsp,jspf}')]
};

var targetPaths = {
	styles: path.join(paths.target.stc, paths.styles),
	scripts: path.join(paths.target.stc, paths.scripts),
	images: path.join(paths.target.stc, paths.images),
	fonts: path.join(paths.target.stc, paths.fonts),
	html: path.join(paths.target.stc)
};

gulp.task('update-bower', function() {
	return $.bower({
		analytics : false,
		cmd : 'update',
		directory : paths.bowerLib
	});
});

gulp.task('update-lib', ['update-bower'], function() {
	var bowerMap = JSON.parse(fs.readFileSync('./bower.map', 'utf8')), property = null;

	for(var i in bowerMap) {
		property = bowerMap[i];
		switch(property.flag) {
			case 'font':
				gulp.src(path.join(paths.bowerLib, property.src.join('/'))).pipe(gulp.dest(path.join(paths.sources.stc, paths.fonts, property.tag.join('/')))).pipe($.size({
					title: '-> ' + i
				}));
				break;
			case 'style':
				gulp.src(path.join(paths.bowerLib, property.src.join('/'))).pipe(gulp.dest(path.join(paths.sources.stc, paths.styles, property.tag.join('/')))).pipe($.size({
					title: '-> ' + i
				}));
				break;
			case 'script':
				gulp.src(path.join(paths.bowerLib, property.src.join('/'))).pipe(gulp.dest(path.join(paths.sources.stc, paths.scripts, paths.lib, property.tag.join('/')))).pipe($.size({
					title: '-> ' + i
				}));
				break;
		}
	}
});

gulp.task('css', function() {
	return gulp.src(sourcesPaths.styles.base).pipe($.cleanCss({
		advanced: false,
		aggressiveMerging: false,
		keepSpecialComments: 0,
		mediaMerging: false,
		processImport: false
	}, function(error, minified) {
		if(error.errors.length > 0) {
			console.log('< minified: ' + minified + ' >');
			console.log(error);
		}
	})).pipe(gulp.dest(targetPaths.styles)).pipe($.size({
		title: '-> CSS'
	}));
});

gulp.task('sass', function() {
	return gulp.src(sourcesPaths.styles.sass).pipe($.sass({
		outputStyle: 'expanded', // nested, expanded, compact, compressed
		precision: 8
	})).pipe(gulp.dest(targetPaths.styles)).pipe($.size({
		title: '-> SASS'
	}));
});

gulp.task('styles', function() {
	return gulp.start(['css', 'sass']);
});

gulp.task('scripts', function() {
	return optimized ? requirejs.optimize({
		allowSourceOverwrites: true,
		appDir: paths.sources.stc + '/' + paths.scripts,
		baseUrl: paths.lib,
		dir: paths.target.stc + '/' + paths.scripts,
		mainConfigFile : paths.sources.stc + '/' + paths.scripts + '/config.js',
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
	})).pipe($.jshint.reporter(require('jshint-stylish'))).pipe(gulp.dest(targetPaths.scripts)).pipe($.size({
		title: '-> Scripts unoptimized'
	}));
});

gulp.task('war', function() {
	return gulp.src(sourcesPaths.war).pipe(gulp.dest(paths.target.war)).pipe($.size({
		title : '-> War'
	}));
});

gulp.task('images', function() {
	return gulp.src(sourcesPaths.images.base).pipe(gulp.dest(targetPaths.images)).pipe($.size({
		title : '-> Images'
	}));
});

gulp.task('fonts', function() {
	return gulp.src(sourcesPaths.fonts.base).pipe(gulp.dest(targetPaths.fonts)).pipe($.size({
		title : 'Fonts'
	}));
});

gulp.task('html', function() {
	return gulp.src(sourcesPaths.html.base).pipe(gulp.dest(targetPaths.html)).pipe($.size({
		title : '-> HTML'
	}));
});

gulp.task('clean', function() {
	return gulp.src([path.join(paths.target.stc, '*'), path.join(paths.target.war, '*'), '!' + path.join(paths.sources.stc, paths.styles, 'web', 'interior_style.css')], {
		read : false
	}).pipe($.clean({
		force : true
	}));
});

gulp.task('watch', function(next) {
	gulp.watch(sourcesPaths.styles.base, ['css']);
	gulp.watch(sourcesPaths.styles.sass, ['sass']);
	gulp.watch(sourcesPaths.scripts.base, ['scripts']);
	gulp.watch(sourcesPaths.images.base, ['images']);
	gulp.watch(sourcesPaths.fonts.base, ['fonts']);
	gulp.watch(sourcesPaths.html.base, ['html']);
	gulp.watch(sourcesPaths.war, ['war']);
	gulp.watch('bower.json', ['update-lib']);
});

// DEFAULT GULP TASK
gulp.task('default', ['clean'], function() {
	gulp.start(['images', 'fonts', 'styles', 'html', 'scripts', 'war']);
});