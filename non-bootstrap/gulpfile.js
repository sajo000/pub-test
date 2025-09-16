const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');

// SCSS → CSS 변환 함수
function buildLayout() {
  return gulp.src('sass/app.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('css'));
}

function buildIframePages() {
  return gulp.src('sass/pages/app-iframe.scss')
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('css'));
}

// 전체 SCSS 빌드(동시에 실행)
const buildAll = gulp.parallel(buildLayout, buildIframePages);

// watch 태스크, 두 파일 모두 감시
function watch() {
  gulp.watch('sass/**/*.scss', { ignoreInitial: false }, buildAll);
}

gulp.task('build', buildAll);     // npm run build 로 전체 빌드
gulp.task('watch', watch);        // npm run watch 로 감시 시작
gulp.task('default', watch);      // gulp 만 써도 watch
