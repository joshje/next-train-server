var gulp = require('gulp');
var sass = require('gulp-sass');
var requirejs = require('gulp-requirejs-optimize');
var bower = require('gulp-bower');
var rename = require("gulp-rename");

gulp.task('css', function() {
  gulp.src('public/css/pebble-settings/main.scss')
  .pipe(sass())
  .pipe(rename('pebble-settings.css'))
  .pipe(gulp.dest('public/css'));
});

gulp.task('bower', function() {
  return bower()
  .pipe(gulp.dest('public/js/lib'));
});

gulp.task('js', ['bower'], function() {
  gulp.src('public/js/pebble-settings/main.js')
  .pipe(requirejs({
    preserveLicenseComments: false,
    out: 'pebble-settings.js',
    paths: {
      text: '../lib/requirejs-hogan-plugin/text',
      hogan: '../lib/requirejs-hogan-plugin/hogan',
      hgn: '../lib/requirejs-hogan-plugin/hgn',
      eventEmitter: '../lib/eventEmitter/EventEmitter'
    }
  }))
  .pipe(gulp.dest('public/js'));
});

gulp.task('watch', function() {
  gulp.watch('public/css/**/*.scss', ['css']);
  gulp.watch(['public/js/pebble-settings/**/*.js', 'public/js/**/*.handlebars'], ['js']);
});

gulp.task('default', ['css', 'js']);
