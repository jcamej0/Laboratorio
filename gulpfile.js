'use strict';

let gulp = require('gulp');
let plugins = require('gulp-load-plugins');
let browser = require('browser-sync');
let rimraf = require('rimraf');
let panini = require('panini');
let lazypipe = require('lazypipe');
let inky = require('inky');
let fs = require('fs');
let siphon = require('siphon-media-query');

const PRODUCTION = !!process.env.PROD;

const $ = plugins();

// Build the "dist" folder by running all of the above tasks
gulp.task('build',
  gulp.series(clean, pages, sassInk, images, inline));

// Build emails, run the server, and watch for file changes
gulp.task('default',
  gulp.series('build', server, watch));

// Delete the "dist" folder
// This happens every time a build starts
function clean(done) {
  rimraf('email/dist', done);
}

// Compile layouts, pages, and partials into flat HTML files
// Then parse using Inky templates
function pages() {

  return gulp.src('email/src/pages/**/*.html')
    .pipe(panini({
      data: 'email/src/data',
      root: 'email/src/pages',
      layouts: 'email/src/layouts',
      partials: 'email/src/partials',
      helpers: 'email/src/helpers',
    }))
    .pipe(inky())
    .pipe(gulp.dest('email/dist'));
}

// Reset Panini's cache of layouts and partials
function resetPages(done) {
  panini.refresh();
  done();
}

// Compile Sass into CSS
function sassInk() {
  return gulp.src('email/src/assets/scss/app.scss')
    .pipe($.if(!PRODUCTION, $.sourcemaps.init()))
    .pipe($.sass({
      includePaths: ['node_modules/foundation-emails/scss']
    }).on('error', $.sass.logError))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest('email/dist/css'));
}

// Copy and compress images
function images() {
  return gulp.src('email/src/assets/img/**/*')
    .pipe($.imagemin())
    .pipe(gulp.dest('email/dist/assets/img'));
}

// Inline CSS and minify HTML
function inline() {
  return gulp.src('email/dist/**/*.html')
    .pipe($.if(PRODUCTION, inliner('email/dist/css/app.css')))
    .pipe(gulp.dest('email/dist'));
}

// Start a server with LiveReload to preview the site in
function server(done) {
  browser.init({
    server: 'email/dist'
  });
  done();
}

// Watch for file changes
function watch() {
  gulp.watch('email/src/pages/**/*.html')
  .on('change', gulp.series(pages, inline, browser.reload));

  gulp.watch(['email/src/layouts/**/*', 'email/src/partials/**/*'])
  .on('change', gulp.series(resetPages, pages, inline, browser.reload));

  gulp.watch(['../scss/**/*.scss', 'email/src/assets/scss/**/*.scss'])
  .on('change', gulp.series(resetPages, sass, pages, inline, browser.reload));

  gulp.watch('email/src/assets/img/**/*')
  .on('change', gulp.series(images, browser.reload));
}

function inliner(css) {
  css = fs.readFileSync(css).toString();
  let mqCss = siphon(css);

  let pipe = lazypipe()
    .pipe($.inlineCss, {
      applyStyleTags: false,
      removeStyleTags: false,
      removeLinkTags: false
    })
    .pipe($.replace, '<!-- <style> -->', `<style>${mqCss}</style>`)
    .pipe($.htmlmin, {
      collapseWhitespace: true,
      minifyCSS: true
    });

  return pipe();
}

gulp.task('dev-assets', dev);
gulp.task('build-assets', gulp.series(buldJS, sass));

function sass() {
  return gulp.src('./public/sass/main.scss')
    .pipe($.sass())
    .pipe(gulp.dest('./public/build/css/'));
}

function dev() {
  gulp.watch('./public/sass/**/*.scss').on('change', gulp.series(sass));
  gulp.watch('./app/**/*.js').on('change', gulp.series(buldJS));
}

function buldJS() {

  return gulp.src('./app/modules/*')
    .pipe($.include())
      .on('error', console.error)
    .pipe($.if(PRODUCTION, $.ngAnnotate()))
      .on('error', console.error)
    .pipe($.if(PRODUCTION, $.uglify()))
      .on('error', console.error)
    .pipe(gulp.dest('./public/build/js/'));
}
