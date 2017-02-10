var gulp = require('gulp'),
	sass = require('gulp-sass'),
	del = require('del'),
	concat = require('gulp-concat'),
	copy = require('gulp-copy'),
	image = require('gulp-image'),
	concatCSS = require('gulp-concat-css');



gulp.task('compile-js',function () {
    del('./build/js/**/*.js').then(function () {
        return gulp
            .src(['./src/js/angular.min.js',
            	'./src/js/angular-route.min.js',
            	'./src/js/angular-ui-router.min.js',
            	'./src/js/app.js',
				'./src/js/controllers/**/*.js'
			])
            .pipe(concat('app.min.js'))
            .pipe(gulp.dest('./build/js/'));
    });
});

gulp.task('compile-css', function(){
	del('./build/css/**/*.css').then(function(){
		return gulp
			.src('./src/scss/app.scss')
			.pipe(sass({ outputStyle: 'compressed'}).on('error', sass.logError))
			.pipe(concatCSS('app.min.css'))
			.pipe(gulp.dest('./build/css/'));
	});
});

gulp.task('html-watch', function(){
	gulp.watch('./src/**/*.html', ['copy-html']);
});


gulp.task('copy-html', function(){
	del('./build/**/*.html').then(function () {
		return gulp
			.src('./src/**/*.html')
			.pipe(gulp.dest('./build/'));
	})
});

gulp.task('copy-fonts', function(){
	return gulp
		.src('./src/fonts/**/*')
		.pipe(gulp.dest('./build/fonts/'));
});

gulp.task('js', function(){
	gulp.watch('./src/js/**/*.js', ['compile-js']);
});

gulp.task('optimize-images', function () {
	return gulp
		.src('./src/images/**/*')
		.pipe(image())
		.pipe(gulp.dest('./build/images/'));
});

gulp.task('sass', function(){
	gulp.watch('./src/scss/**/*.scss',['compile-css']);
});
gulp.task('default',['compile-js','compile-css','js','sass','copy-html','copy-fonts','copy-html','html-watch','optimize-images']);
