const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));

gulp.task('buildSass', function () {
  return gulp.src('sass/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('css'));
});

gulp.task('watch', function () {
  gulp.watch('sass/**/*.scss', { ignoreInitial: false }, gulp.series('buildSass'));
});

gulp.task('default', gulp.series('watch'));