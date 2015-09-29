/**
 * Marching gulpfiles.js
 * 
 */

var config = {
	optimized : false
}
var gulp = require('gulp');
var path = require('path');
var mergeStream = require('merge-stream');
var requirejs = require('requirejs');
var $ = require('gulp-load-plugins')();
var formats = {
	script : '*.{js,map}',
	style : '*.{sass,scss}',
	font : '*.{eot,svg,ttf,woff,woff2}',
	image : '*.{png,gif,jpg,ico}'
}
var pathNames = {
	sourcesUrl : '',
	targetUrl : 'dist',
	bowerLib : 'bower_components',
	styles : 'css',
	scripts : 'js',
	images : 'images',
	fonts : 'fonts',
	exclude : [ '!*/**/{build,demos,test,docs,versions,source/dev,source/jquery}/**/*' ],
	exBootstrap : '!*/**/bootstrap/**/*'
};

var sourcesPaths = {
	styles : {
		base : path.join(pathNames.sourcesUrl, pathNames.styles, '**', '*.css'),
		sass : path.join(pathNames.sourcesUrl, pathNames.styles, '**', formats.style),
		bower : [ path.join(pathNames.sourcesUrl, pathNames.bowerLib, '**', '*.css'), pathNames.exBootstrap ].concat(pathNames.exclude),
		bootstrap : [ path.join(pathNames.sourcesUrl, pathNames.bowerLib, '**', 'bootstrap-sass-official', '**', 'stylesheets', '**', formats.style) ].concat(pathNames.exclude)
	},
	scripts : {
		base : [ path.join(pathNames.sourcesUrl, pathNames.scripts, '**', formats.script), path.join(pathNames.sourcesUrl, pathNames.scripts, '**', '*.json') ],
		bower : [ path.join(pathNames.sourcesUrl, pathNames.bowerLib, '**', formats.script) ].concat(pathNames.exclude, [ '!*/**/Gruntfile.js', '!*/**/gulpfile.js' ])
	},
	images :  {
		base : [ path.join(pathNames.sourcesUrl, '**', formats.image), '!' + path.join(pathNames.sourcesUrl, '**', pathNames.bowerLib, '**', formats.image)],
		bower : [ path.join(pathNames.sourcesUrl, pathNames.bowerLib, '**', formats.image), pathNames.exBootstrap ].concat(pathNames.exclude),
		bootstrap : [ path.join(pathNames.sourcesUrl, pathNames.bowerLib, '**', 'images', 'bootstrap', '**', formats.image) ].concat(pathNames.exclude)
	},
	fonts : {
		base : path.join(pathNames.sourcesUrl, pathNames.fonts, '**', formats.font),
		bower : [ path.join(pathNames.sourcesUrl, pathNames.bowerLib, '**', formats.font), pathNames.exBootstrap ].concat(pathNames.exclude),
		bootstrap : [ path.join(pathNames.sourcesUrl, pathNames.bowerLib, '**', 'bootstrap', '**', formats.font) ].concat(pathNames.exclude)
	},
	war : [ path.join(pathNames.sourcesUrl, '{WEB-INF,META-INF}', '**', '*'), path.join(pathNames.sourcesUrl, '**', '*.{html,jsp}'), '!' + path.join(pathNames.sourcesUrl, pathNames.bowerLib, '**', '*') ]
};

var targetPaths = {
	styles : path.join(pathNames.targetUrl, pathNames.styles),
	scripts : path.join(pathNames.targetUrl, pathNames.scripts),
	images : path.join(pathNames.targetUrl, pathNames.images),
	fonts : path.join(pathNames.targetUrl, pathNames.fonts),
	j2eeBower : path.join('..', 'modules', 'estore', 'j2ee', 'acsdocroot.war', pathNames.bowerLib)
}

gulp.task('init-styles', [ 'init-bower' ], function() {
	return sassBootstrap();
});

gulp.task('styles', function() {
	var bcssStream, scssStream;
	var est = false;

	bcssStream = minifyCss(gulp.src(sourcesPaths.styles.base)).pipe(gulp.dest(targetPaths.styles)).pipe($.size());
	scssStream = sassBootstrap();

	return est ? mergeStream(bcssStream, scssStream) : bcssStream;
});

gulp.task('optimization', function() {
	setTimeout(function() {
		if(gulp.tasks[ 'copy-bower' ].done === true || gulp.tasks[ 'copy-bower' ].running !== true) {
			requirejs.optimize({
				allowSourceOverwrites : true,
				appDir : pathNames.sourcesUrl + '/scripts',
				baseUrl : 'lib',
				dir : pathNames.targetUrl + '/scripts',
				mainConfigFile : 'requirejs-main.js',
				keepBuildDir : true,
				optimize : 'uglify',
				preserveLicenseComments : false,
				waitSeconds : 0
			}, function(buildResponse) {
				/* To get the optimized file contents. */
				/* var contents = fs.readFileSync(config.out, 'utf8'); */
			}, function(error) {
				console.log('RequireJS Optimization Failed.');
				console.log(error);
				/* Deal With JavaScript Files Without Optimization */
				gulp.start('scripts');
			});
		} else {
			var that = arguments;
			
			setTimeout(function() {
				that.callee();
			}, 100);
		}
	}, 1);
});

gulp.task('scripts', function() {
	gulp.src(sourcesPaths.scripts.base).pipe(gulp.dest(targetPaths.scripts)).pipe($.size({
		title : 'Scripts'
	}));
});

gulp.task('war', function() {
	gulp.src(sourcesPaths.war).pipe(gulp.dest(pathNames.targetUrl)).pipe($.size({
		title : 'War'
	}));
});

gulp.task('images', function() {
	gulp.src(sourcesPaths.images.base).pipe(gulp.dest(pathNames.targetUrl)).pipe($.size({
		title : 'Images'
	}));
});

gulp.task('fonts', function() {
	gulp.src(sourcesPaths.fonts.base).pipe(gulp.dest(targetPaths.fonts)).pipe($.size({
		title : 'Fonts'
	}));
});

/**
 * Install or Update Bower Components.
 */
gulp.task('init-bower', function() {
	return $.bower({
		analytics : false,
		cmd : 'update',
		directory : path.join(pathNames.sourcesUrl, pathNames.bowerLib)
	});
});

gulp.task('doNothing', function() {
	return null;
});

// Copy Bower Assets
gulp.task('copy-bower', function() {
	var bcssStream, bjsStream, bFontsStream, bootFontsStream, bootImagesStream;

	bcssStream = minifyCss(gulp.src(sourcesPaths.styles.bower)).pipe(gulp.dest(targetPaths.styles)).pipe($.size({
		title : 'Bower CSS'
	}));
	bjsStream = gulp.src(sourcesPaths.scripts.bower).pipe(gulp.dest(path.join(targetPaths.scripts, 'lib'))).pipe($.size({
		title : 'Bower JS'
	}));
	bFontsStream = gulp.src(sourcesPaths.fonts.bower).pipe($.flatten()).pipe(gulp.dest(targetPaths.fonts)).pipe($.size({
		title : 'Bower Fonts'
	}));
	/* Copy Bootstrap Fonts Into fonts/bootstrap */
	bootFontsStream = gulp.src(sourcesPaths.fonts.bootstrap).pipe($.flatten({
		newPath : 'bootstrap'
	})).pipe(gulp.dest(targetPaths.fonts)).pipe($.size({
		title : 'Bootstrap Fonts'
	}));
	/* Copy Bootstrap Fonts Into images/bootstrap */
	bootImagesStream = gulp.src(sourcesPaths.images.bootstrap).pipe($.flatten({
		newPath : 'bootstrap'
	})).pipe(gulp.dest(targetPaths.images)).pipe($.size({
		title : 'Bootstrap Images'
	}));

	return mergeStream(bcssStream, bjsStream, bFontsStream, bootFontsStream, bootImagesStream);
});

gulp.task('clean', function() {
	return gulp.src(path.join(pathNames.targetUrl, '*'), {
		read : false
	}).pipe($.clean({
		force : true
	}));
});

gulp.task('watch', function(next) {
	gulp.watch([ sourcesPaths.styles.base, sourcesPaths.styles.sass ], [ 'styles' ]);
	//gulp.watch(sourcesPaths.scripts.base, [ 'scripts' ]);
	//gulp.watch(sourcesPaths.images.base, [ 'images' ]);
	//gulp.watch(sourcesPaths.war, [ 'war' ]);
	gulp.watch('bower.json', [ 'copy-bower' ]);
});

// DEFAULT GULP TASK
gulp.task('default', [ 'clean' ], function() {
	var tasks = [ 'copy-bower', 'war', 'images', 'fonts', 'styles', config.optimized ? 'optimization' : 'scripts' ];
	
	if(!config.optimized) {
		tasks.push('watch');
	}
	gulp.start(tasks);
});

gulp.task('test', [ 'clean', 'init-bower' ], function() {
	var tasks = [ 'copy-bower', 'images', 'fonts', 'styles', 'scripts', 'watch' ];

	gulp.start(tasks);
});

function minifyCss(src) {
	return src.pipe($.minifyCss({
		keepSpecialComments : 0,
		processImport : false
	}));
}

function sassBootstrap() {
	return gulp.src(sourcesPaths.styles.sass).pipe($.sass({
		outputStyle : config.optimized ? 'compressed' : 'nested',
		precision : 8
	})).pipe(gulp.dest(targetPaths.styles)).pipe($.size({
		title : 'Styles Sass'
	}));
}