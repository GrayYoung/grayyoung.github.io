/**
 * Marching gulpfiles.js
 * 
 */

var config = {
	optimized : true
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
	sourcesUrl : '.',
	targetUrl : 'dist',
	bowerLib : 'bower_components',
	styles : 'css',
	scripts : 'js',
	images : 'images',
	fonts : 'fonts',
	exclude : [ '!*/**/{build,demos,test,docs,versions,source/dev,source/jquery,node_modules}/**/*', '!dist' ],
	exBootstrap : '!*/**/bootstrap/**/*'
};

var sourcesPaths = {
	styles : {
		base : path.join(pathNames.sourcesUrl, pathNames.styles, '**', formats.style),
		sass : path.join(pathNames.sourcesUrl, '_sass', '**', formats.style)
	},
	scripts : {
		base : [ path.join(pathNames.sourcesUrl, pathNames.scripts, '**', formats.script), path.join(pathNames.sourcesUrl, pathNames.scripts, '**', '*.json') ]
	}
};

var targetPaths = {
	styles : path.join(pathNames.targetUrl, pathNames.styles),
	scripts : path.join(pathNames.targetUrl, pathNames.scripts)
}

gulp.task('init-styles', [ 'init-bower' ], function() {
	return sassBootstrap();
});

gulp.task('styles', function() {
	return gulp.src(sourcesPaths.styles.base).pipe($.sass({
		outputStyle : config.optimized ? 'compact' : 'expanded',
		precision : 8
	})).pipe($.minifyCss({
		keepSpecialComments : 0,
		processImport : false
	})).pipe(gulp.dest(targetPaths.styles)).pipe($.size({
		title : 'Styles Sass'
	}));
});

gulp.task('js', function() {
	return gulp.src(sourcesPaths.scripts.base).pipe(gulp.dest(path.join('_site', targetPaths.scripts))).pipe($.size({
		title : 'JS'
	}));
});

gulp.task('scripts', function() {
	requirejs.optimize({
		allowSourceOverwrites : true,
		appDir : pathNames.sourcesUrl + '/' + pathNames.scripts,
		baseUrl : 'lib',
		dir : pathNames.targetUrl + '/' + pathNames.scripts,
		mainConfigFile : pathNames.sourcesUrl + '/' + pathNames.scripts + '/config.js',
		keepBuildDir : true,
		optimize : config.optimized ? 'uglify2' : 'none',
		uglify2 : {
			output : {
				beautify : false
			},
			compress : {
				sequences : false,
				global_defs : {
					DEBUG : false
				}
			},
			warnings : true,
			mangle : true
		},
		preserveLicenseComments : false,
		waitSeconds : 0
	}, function(buildResponse) {
		/* To get the optimized file contents. */
		/* var contents = fs.readFileSync(config.out, 'utf8'); */
		console.log('RequireJS Optimized Successful.');
	}, function(error) {
		console.log('RequireJS Optimize Failed.');
		console.log(error);
	});
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

gulp.task('update-sources', function() {
	var sources = [
		['jquery', path.join(pathNames.bowerLib, 'jquery', 'dist', 'jquery.min.js,jquery.slim.min.js')], 
		['slick-carousel', path.join(pathNames.bowerLib, 'bootstrap-sass-official', 'assets', 'javascripts', 'bootstrap.min.js')], 
		['slick-carousel', path.join(pathNames.bowerLib, 'slick-carousel', 'slick', 'slick.min.js')], 
		['html5shiv', path.join(pathNames.bowerLib, 'html5shiv', 'dist', 'html5shiv.min.js,html5shiv-printshiv.min.js')], 
		['js-xlsx', path.join(pathNames.bowerLib, 'js-xlsx', 'dist', 'xlsx.min.js')], 
		['requirejs', path.join(pathNames.bowerLib, 'requirejs', 'requirejs.js')], 
		['respond', path.join(pathNames.bowerLib, 'respond', 'dest', 'respond.min.js')], 
	];
	for(var s in sources) {
		gulp.src(sources[s][1]).pipe(gulp.dest(path.join(pathNames.sourcesUrl, pathNames.scripts, 'lib'))).pipe($.size({
			title : sources[s][0]
		}));
	}
});

gulp.task('doNothing', function() {
	return null;
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
	gulp.watch(sourcesPaths.scripts.base, [ 'js' ]);
	gulp.watch('bower.json', [ 'init-bower' ]);
});

// DEFAULT GULP TASK
gulp.task('default', [ 'clean' ], function() {
	var tasks = [ 'styles', 'scripts' ];

	if(!config.optimized) {
		tasks.push('watch');
	}
	gulp.start(tasks);
});