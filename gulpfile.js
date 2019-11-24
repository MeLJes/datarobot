const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser'); // Minify JS
const concat = require('gulp-concat'); // Concat all JS file into one
const del = require('del');
const browserSync = require('browser-sync').create();

const paths = {
  styles: {
    src: './scss/**/*.scss',
    dest: 'css/'
  },
  scripts: {
    src: ['./js/**/*.js', '!./js/**/main.min.js'],
    dest: 'js/'
  },
  html: {
    src: './*.html',
    dest: './'
  }
};

function clean() {
  return del(['assets']);
}

// --- Default
function style() {
  return gulp.src(paths.styles.src, { sourcemaps: true })
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// --- Watch
function watch() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  })

  gulp.watch(paths.styles.src, style);
  gulp.watch(paths.html.src).on('change', browserSync.reload);
  gulp.watch(paths.scripts.src).on('change', browserSync.reload);
}

// --- Build
function buildCSS() {
  return gulp.src(paths.styles.src, { sourcemaps: true })
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer('last 5 versions'))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.styles.dest))
}
function buildJS() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    // .pipe(babel())
    .pipe(terser())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}
const build = gulp.series(clean, gulp.parallel(buildCSS, buildJS));

// --- Tasks
exports.default = watch;
exports.style = style;
exports.watch = watch;
exports.build = build;
