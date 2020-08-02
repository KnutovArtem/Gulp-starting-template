const { src, dest, parallel, series, watch } = require('gulp');
const browserSync  = require('browser-sync').create();
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify-es').default;
const scss         = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleancss     = require('gulp-clean-css');
const imagemin     = require('gulp-imagemin');
const babel        = require('gulp-babel');
const del          = require('del');

/*Reboot*/
function browsersync() {
    browserSync.init({
        server: {
            baseDir: "app",
            index: "index.html"
        },
        notify: false,
        //online: false,
        //logLevel: "debug",
        //tunnel: true,
        //browser: "chrome",
    });
}


/*Style files*/
function stylesmin() {
    return src('app/scss/main.scss')
    .pipe(scss())
    .pipe(concat('main.min.css'))
    .pipe(autoprefixer({
        overrideBrowserslist: [ 'last 10 versions' ],
        grid: true
    }))
    .pipe(cleancss(({
        level: { 1: { specialComments: 0 } },
    })))
    .pipe(dest('app/css/'))
    .pipe(browserSync.stream());
}

/*Style files*/
function styles() {
    return src('app/scss/main.scss')
        .pipe(scss())
        .pipe(concat('main.min.css'))
        .pipe(autoprefixer({
            overrideBrowserslist: [ 'last 10 versions' ],
            grid: true
        }))
        .pipe(cleancss(({
            level: { 1: { specialComments: 0 } },
            format: 'beautify'
        })))
        .pipe(dest('app/css/'))
        .pipe(browserSync.stream());
}

/*JS files*/
function scripts() {
    return src([
        // 'node_modules/...',
        'app/js/dev/*.js'
    ])
        .pipe(babel({
            presets: ['@babel/env'],
            plugins: ["babel-plugin-loop-optimizer"],
        }))
        .pipe(concat('script.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream());
}

/*Images*/
function images() {
    return src('app/img/src/**/*')
        .pipe(imagemin())
        .pipe(dest('dist/img/src'));
}

/*Clearing the img folder*/
function cleanimg() {
    return del('dist/img/src', { force: true });
}

/*Clearing the dist folder*/
function cleandist() {
    return del('dist/**/*', { force: true });
}

//function cleanoppa() {
//    return del('dist/img/src', { force: true });
//}

/*Build*/
function buildcopy() {
    return src([
        'app/css/**/*.min.css',
        'app/js/**/*.min.js',
        'app/img/**/*',
        'app/**/*.html'
        ], { base: 'app' })
    .pipe(dest('dist'));
}

/*File tracking*/
function startwatch() {
    watch('app/scss/**/*.scss', styles);
    watch([ 'app/js/**/*.js', '!app/js/**/*.min.js' ], scripts);
    watch('app/**/*.html').on('change', browserSync.reload);
    //watch('app/img/src/**/*', images);
}

/*Export task*/
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.cleanimg = cleanimg;
exports.cleandist = cleandist;
exports.babel = babel;
exports.prod = parallel(cleandist, stylesmin, images, cleanimg, scripts, buildcopy);
exports.dev = parallel(styles, scripts, browsersync, startwatch);
