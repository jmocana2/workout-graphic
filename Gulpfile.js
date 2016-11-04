var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var babel = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('styles', function() {
	gulp
		.src('scss/main.scss')
		.pipe(sass())
		.pipe(gulp.dest('dist/css'));
});

gulp.task('assets', function() {
	gulp
		.src('assets/*')
		.pipe(gulp.dest('dist'));
});

gulp.task('scripts', function() {
	browserify('./src/index.js')
		.transform(babel)
		.bundle()
		.pipe(source('index.js'))
		.pipe(rename('app.js'))
		.pipe(gulp.dest('dist/js'));
})

gulp.task('default', ['styles', 'assets', 'scripts']);