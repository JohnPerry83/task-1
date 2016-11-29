import gulp from 'gulp';
import del from 'del';
import runSequence from 'run-sequence';
import fs from 'fs-extra';

const argv = require('yargs').argv;
const isProd = (argv.production === undefined) ? false : true;
const isDebug = (argv.debug === undefined) ? false : true;
const paths = require('./paths')(isProd);
const $ = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();

// global.COMPONENT_NAMESPACE = 'coop';

var AUTOPREFIXER_BROWSERS = [
    'ie >= 8',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
];

// compile SASS
gulp.task('styles', () => {
    return gulp.src(paths.styles.src)
        .pipe(!isProd ? $.sourcemaps.init() : $.util.noop())
        // .pipe($.preprocess({ 
        //     context: { 
        //         DEBUG: !isProd 
        //     }
        // }))
        .pipe($.sass({
            sync: true,
            precision: 10,
            outputStyle: isProd ? 'compressed' : 'nested'
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(isProd ? $.csso() : $.util.noop())
        .pipe(gulp.dest(paths.styles.dest))

        .pipe(!isProd ? $.sourcemaps.write('./') : $.util.noop())
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream({ once: true }));
});

// Combine global JS
gulp.task('concat.js.global', () => {
    return gulp.src(paths.scripts.global.src)
        .pipe($.concat(paths.scripts.global.filename))
        .pipe(gulp.dest(paths.scripts.global.dest));
});

// Combine vendor JS
gulp.task('concat.js.vendor', () => {
    return gulp.src(paths.scripts.vendor.src)
        .pipe($.concat(paths.scripts.vendor.filename))
        .pipe(gulp.dest(paths.scripts.vendor.dest));
});

gulp.task('copy.vendor', () => {
    return gulp.src('./src/js/vendor/**')
        .pipe(gulp.dest(paths.output + '/js/vendor'));
});

gulp.task('scripts', ['concat.js.global', 'concat.js.vendor'], () => {
    return gulp.src(paths.scripts.src)
        .pipe(isProd ? $.stripDebug() : $.util.noop())
        .pipe(isProd ? $.rename({ suffix: '.min' }) : $.util.noop())
        .pipe(!isProd ? $.sourcemaps.init() : $.util.noop())
        .pipe(isProd ? $.uglify() : $.util.noop())
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(!isProd ? $.sourcemaps.write('./') : $.util.noop())
        .pipe(gulp.dest(paths.scripts.dest))
        .pipe(browserSync.stream({ once: true }));
});

gulp.task('views', () => {
    return gulp.src(paths.views.src)
        .pipe($.preprocess({ context: { ENV: isProd ? 'production' : $.util.noop() }}))
        .pipe(gulp.dest(paths.views.dest));
});

gulp.task('copy.data', () => {
    return gulp.src('./src/data.json')
        .pipe(gulp.dest(paths.output));
});

gulp.task('copy.index', () => {
    return gulp.src('./src/index.html')
        .pipe(gulp.dest(paths.output));
});


// Serve the site via browser-sync
gulp.task('serve', () => {
    browserSync.init({
        server: {
            baseDir: paths.servePath
        },
        port: 8080,
        ui: {
            port: 8081,
            weinre: {
                port: 9090
            }
        },
        notify: false,
    });
});

// Remove the output folder
gulp.task('clean', done => del(paths.output, done));
gulp.task('clean.after', done => del(paths.cleanup.glob, done));

// watch files for changes
gulp.task('watch', ['serve'], () => {
    gulp.watch(paths.scripts.glob, ['scripts']);
    gulp.watch(paths.styles.src, ['styles']);
    gulp.watch(paths.views.src, ['views']);
    // gulp.watch(paths.images.src, ['images']);
});

gulp.task('dev', () => runSequence('build', 'watch'));
gulp.task('build', cb => runSequence('clean', ['scripts', 'styles','copy.index', 'copy.data', 'views'], /*'gzip',*/ 'clean.after', cb));
gulp.task('default', ['dev']);
