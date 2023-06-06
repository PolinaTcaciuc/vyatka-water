const { src, dest, watch, parallel, series } = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const concat = require("gulp-concat");
const clean = require("gulp-clean");
const webpack = require("webpack-stream");
const fileinclude = require("gulp-file-include");

const fonts = () => {
  return src("./src/assets/fonts/*").pipe(dest("./dist/fonts/"));
};

const htmlInclude = () => {
  return src(["./src/**/*.html"])
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(dest("./dist"))
    .pipe(browserSync.stream());
};
const imagesInclude = () => {
  return src(["./src/assets/images/**/*"])
    .pipe(dest("./dist/images"))
    .pipe(browserSync.stream());
};
function styles() {
  return src(["src/assets/styles/style.scss"])
    .pipe(concat("style.min.css"))
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(sass())
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
}
function cleanDist() {
  return src("dist/", { read: false }).pipe(clean());
}

function scripts() {
  return src("src/assets/js/**/*.js")
    .pipe(
      webpack({
        mode: "development",
        output: {
          filename: "main.js",
        },
        module: {
          rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: ["@babel/preset-env"],
                },
              },
            },
          ],
        },
      })
    )
    .pipe(dest("dist/js"))
    .pipe(browserSync.stream());
}

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "dist/",
    },
  });
}

function watching() {
  watch("src/assets/styles/**/*.scss", styles);
  watch("src/**/*.html", htmlInclude);
  watch("src/assets/images/**/*", imagesInclude);
  watch("src/assets/js/**/*.js", scripts);
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;

exports.default = parallel(
  fonts,
  styles,
  htmlInclude,
  scripts,
  imagesInclude,
  watching,
  browsersync
);
exports.build = series(
  cleanDist,
  parallel(htmlInclude, scripts, fonts),
  styles
);
