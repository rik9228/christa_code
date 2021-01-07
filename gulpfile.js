// gulpプラグインの読みこみ
const gulp = require("gulp");
// Sassをコンパイルするプラグインを読み込みます
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const csscomb = require("gulp-csscomb");
const cached = require("gulp-cached");
const replace = require("gulp-replace");
const notify = require("gulp-notify");
const plumber = require("gulp-plumfber");
const uglify = require("gulp-uglify");
let uglifyES = require("gulp-uglify-es");
// ejs
const ejs = require("gulp-ejs");
// rename
const rename = require("gulp-rename");
//画像圧縮
const imagemin = require("gulp-imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
const imageminSvgo = require("imagemin-svgo");
// FTPアップ
const FtpDeploy = require("ftp-deploy");
const ftpDeploy = new FtpDeploy();
// ブラウザリロード
const browserSync = require("browser-sync");
const data = require("gulp-data");

//gulpコマンドの省略
const { watch, series, task, src, dest, parallel } = require("gulp");

//参照元パス
const srcPath = {
  html: "src/**.html",
  html02: "src/html/**.html",
  css: "src/dist/css/**/**.css",
  scss: "src/scss/**/**.scss",
  js: "src/js/*.js",
  ejs: "src/ejs/**/*.ejs",
  img: "src/img/**/*",
};

//出力先パス
const destPath = {
  css: "src/dist/css",
  js: "src/dist/js",
  img: "src/dist/img/",
};

// //画像圧縮（デフォルトの設定）
// const imgImagemin = () => {
//  return src(srcPath.img)
//    .pipe(
//      imagemin(
//        [
//          imageminMozjpeg({
//            quality: 80
//          }),
//          imageminPngquant(),
//          imageminSvgo({
//            plugins: [
//              {
//                removeViewbox: false
//              }
//            ]
//          })
//        ],
//        {
//          verbose: true
//        }
//      )
//    )
//    .pipe(dest(destPath.img))
// }

//画像圧縮
task("imageMin", function () {
  return src(srcPath.img)
    .pipe(
      imagemin(
        [
          imageminMozjpeg({
            quality: 80,
          }),
          imageminPngquant(),
          imageminSvgo({
            plugins: [
              {
                removeViewbox: false,
              },
            ],
          }),
        ],
        {
          verbose: true,
        }
      )
    )
    .pipe(dest(destPath.img));
});

//FTP
gulp.task("ftp", (done) => {
  ftpDeploy.deploy(ftpOptions, (error) => {
    if (error) {
      console.log("Error", error);
    }
  });
  done();
});

// ejs
task("ejs", () => {
  return src(["src/ejs/**/*.ejs", "!" + "src/ejs/**/_*.ejs"])
    .pipe(
      data((file) => {
        return {
          filename: file.path,
        };
      })
    )
    .pipe(ejs())
    .pipe(rename({ extname: ".html" }))
    .pipe(replace(/[\s\S]*?(<!DOCTYPE)/, "$1"))
    .pipe(dest("./src"));
});

// csscomb
task("csscomb", function () {
  return src(srcPath.css).pipe(csscomb()).pipe(cached("cache")).pipe(dest(destPath.css));
});

//Sass
task("sass", function () {
  return src(srcPath.scss)
    .pipe(sourcemaps.init()) // ソースマップを初期化
    .pipe(
      sass({
        outputStyle: "expanded", // Minifyするなら'compressed'
      })
    )
    .pipe(
      autoprefixer({
        cascade: false,
        grid: true,
      })
    )
    .pipe(csscomb())
    .pipe(sourcemaps.write("./")) // ソースマップの作成
    .pipe(dest(destPath.css));
});

//JS 圧縮
task("js", function () {
  return src(srcPath.js);
  // .pipe(plumber())
  // .pipe(uglify())
  // .pipe(dest(destPath.js))
});

//html 編集反映
task("html", function () {
  return src(srcPath.html);
});

// browser-sync
task("browser-sync", () => {
  return browserSync.init({
    server: {
      baseDir: "./src",
    },
    port: 8080,
    reloadOnRestart: true,
  });
});

// browser-sync reload
task("reload", (done) => {
  browserSync.reload();
  done();
});

//watch
// 定義したタスク関数を記述していく
task("watch", (done) => {
  watch([srcPath.css], series("csscomb"));
  watch([srcPath.scss], series("sass", "reload"));
  watch([srcPath.js], series("js", "reload"));
  watch([srcPath.ejs], series("ejs", "reload"));
  watch([srcPath.html], series("html", "reload"));
  done();
});

// gulp　で起動
task("default", parallel("watch", "browser-sync", "imageMin"));
