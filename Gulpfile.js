var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var babel = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var uglify = require('gulp-uglify');

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

function compile(watch) {
	var bundle = watchify(browserify('./src/index.js'))

	function rebundle() {
		bundle
			.transform(babel)
			.bundle()
			.pipe(source('index.js'))
			.pipe(buffer())
			.pipe(uglify())
			.pipe(rename('bundle.js'))
			.pipe(gulp.dest('dist/js'));
	}

	if(watch) {
		bundle.on('update', function() {
			console.log('--> Bundling...')
			rebundle()
		})
	}

	rebundle();
}

gulp.task('scripts', function() {
	browserify('./src/index.js')		
})

gulp.task('build', function() {
	return compile();
});

gulp.task('watch', function() {
	return compile(true);
});

gulp.task('default', ['styles', 'assets', 'build']);