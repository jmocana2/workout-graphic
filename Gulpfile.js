//require
var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var babel = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var express = require('express');
var path = require('path'); 
var ts = require('gulp-typescript');

//source paths
var source_paths = {  
  path_sass: './src/scss/**/*.scss',
  path_js: './src/js/**/*.js',
  path_ts: './src/ts/**/*.ts',
  path_html: './src/html/**/*.html',
  path_assets: './asets/**/*'
}

//html
gulp.task('html', function() {  
  return gulp.src(source_paths.path_html)
    .pipe(gulp.dest('./dist'));

  console.log("html+");  
})

//scss to css
gulp.task('styles', function() {
	return gulp.src(source_paths.path_sass)
	    .pipe(sass.sync().on('error', sass.logError))
	    .pipe(gulp.dest('./dist/css'));

	console.log("css+");    
});

//assets (img)
gulp.task('assets', function() {
	gulp
		.src(source_paths.path_assets)
		.pipe(gulp.dest('dist'));

	console.log("assets+");	
});

//js
gulp.task('scripts', function() {
	var entry = './src/js/index.js'; //Script de entrada 
	var args = watchify.args; 
	args.debug = true; //Genera el sourcemap para debuguear
	args.fullPaths = false; //Evita el uso de paths absolutos 

	var bundle = watchify(browserify(entry, args))
	bundle
		.transform(babel)
		.bundle()
		.pipe(source('src/js/index.js'))
		.pipe(buffer())
		//.pipe(uglify()) descomentar para minificar el js
		.pipe(rename('bundle.js'))
		.pipe(gulp.dest('dist/js'));

	console.log("js+");	
});

//typescript
gulp.task('ts', function () {
    return gulp.src(source_paths.path_ts)
        .pipe(ts({
            noImplicitAny: true,
            out: 'bundle.js'
        }))
        .pipe(gulp.dest('dist/js'));

    console.log("ts+");    
});

//server (express)
gulp.task('server', function() {
	var app = express();

	app.use(express.static('dist'));

	app.get('/', function(req, res) {
	  res.sendFile(path.join(__dirname + '/index.html'));
	});

	app.listen(3000, function(err) {
		if(err) {
			return console.log('Hubo un error: ' + err), process.exit(1);
		}
		console.log("servidor levantado y escuchando en el puerto 3000...")
	})
	browserSync({ proxy: 'localhost:3000' });
});

//build
gulp.task('build', ['html', 'styles', 'assets', 'ts']);

//watch
gulp.task('watch', function() {
	gulp.watch(source_paths.path_sass, ['styles', browserSync.reload]);
	gulp.watch(source_paths.path_html, ['html', browserSync.reload]);
	gulp.watch(source_paths.path_js, ['scripts', browserSync.reload]);
	gulp.watch(source_paths.path_ts, ['ts', browserSync.reload]);
	gulp.watch(source_paths.path_assets, ['assets', browserSync.reload]);
});

//default
gulp.task('default', ['server','html', 'styles', 'assets', 'ts', 'watch']);