const { src, dest, watch, parallel,series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const clean = require('gulp-clean');
// const uglify  = require ('gulp-uglify') ;
const webpack = require('webpack-stream');

const fonts = () => {
	return src('./src/assets/fonts/*')
		.pipe(dest('./dist/fonts/'))
}

const htmlInclude = () => {
	return src(['./src/index.html'])
		.pipe(dest('./dist'))
		.pipe(browserSync.stream());
}
const imagesInclude = () => {
	return src(['./src/assets/images/**/*'])
		.pipe(dest('./dist/images'))
		.pipe(browserSync.stream());
}
function styles() {
    return src([
         'src/assets/styles/nullstyle.scss',
         'src/assets/styles/fonts.scss',
         'src/assets/styles/vars.scss',
         'src/assets/styles/mygrid.scss',
         'src/assets/styles/common.scss',
         'src/assets/styles/**/*.scss'

     ])
         .pipe(concat('style.min.css'))
         .pipe(sass({ outputStyle: 'compressed' }))
         .pipe(sass())
         .pipe(dest('dist/css'))
         .pipe(browserSync.stream());
 }
 function cleanDist() {
	return src('dist/',{read: false})
    .pipe(clean());
}

function scripts() {
    return src('src/assets/js/main.js')
      .pipe(webpack(require('./webpack.config.js')))
      .pipe(dest('dist/js'))
      .pipe(browserSync.stream());
  };

function browsersync() {
    browserSync.init({
        server: {
            baseDir: "dist/"
        }
    });
}

function watching() {
    watch('src/assets/styles/**/*.scss', styles)
	watch('src/index.html', htmlInclude);
    watch('src/assets/images/**/*', imagesInclude)
    watch('src/assets/js/**/*.js', scripts)
}


exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;

exports.default = parallel(styles,htmlInclude,scripts,imagesInclude,fonts,watching, browsersync)
exports.build = series(cleanDist, parallel(htmlInclude,scripts,fonts), styles);
