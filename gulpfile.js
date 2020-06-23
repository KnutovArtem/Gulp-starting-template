'use strict';
const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const babel = require("gulp-babel");
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const notify = require("gulp-notify");

// babel
gulp.task("default", function () {
	return gulp.src('app/js/common.js')
		.pipe(babel())
		.pipe(gulp.dest('app'));
});

// browser-sync
gulp.task('browser-sync', function () {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false,
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
});

// js
gulp.task('js', function () {
	return gulp.src([
			'app/js/common.js',
		])
		.pipe(babel())
		.pipe(concat('scripts.min.js'))
		 .pipe(uglify())
		.pipe(gulp.dest('app/js'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

// sass
gulp.task('scss', function () {
	return gulp.src('app/sass/**/*.scss')
		.pipe(sass({
			outputStyle: 'expand'
		}).on("error", notify.onError()))
		.pipe(rename({
			suffix: '.min',
			prefix: ''
		}))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleanCSS())
		.pipe(concat('main.min.css'))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

// html
gulp.task('code', function () {
	return gulp.src('app/**/*.html')
		.pipe(browserSync.reload({
			stream: true
		}));
});

// watch
gulp.task('watch', function () {
	gulp.watch('app/sass/**/*.scss', gulp.parallel('scss'));
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('js'));
	gulp.watch('app/*.html', gulp.parallel('code'));
});

gulp.task('default', gulp.parallel('scss', 'js', 'browser-sync', 'watch'));