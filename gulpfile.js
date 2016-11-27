'use strict';
var changed = require('gulp-changed');
var del = require('del');
var gulp = require('gulp');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var nodemon = require('gulp-nodemon')
var assets = 'src/**/*.**';


var PATHS = {
  client: {
    mainhtml: 'src/index.html',
    views: 'src/views/**/*.{jade,html}',
    js:[
      'src/js/libs/jquery.js',
      'src/js/config.js',
      'src/js/libs/html2canvas.js',
      'src/js/libs/angular.min.js',
      'src/js/libs/angular-route.min.js',
      'src/js/libs/angular-ui-router.min.js',
      'src/js/libs/bootstrap.min.js',
      'src/js/libs/bootstrap-notify.min.js',
      'src/js/libs/satellizer.min.js',
      'src/js/libs/email.min.js',
      'src/js/libs/moment.js',
      'src/js/libs/ng-file-upload-shim.min.js',
      'src/js/libs/ng-file-upload.min.js',
      'src/js/app.js',
      'src/js/controllers/authCtrl.js',
      'src/js/controllers/contributeCtrl.js',
      'src/js/controllers/homeCtrl.js',
      'src/js/controllers/editCtrl.js',
      'src/js/controllers/moderateCtrl.js',
      'src/js/controllers/sideCtrl.js',
      'src/js/controllers/postCtrl.js',
      'src/js/controllers/postsCtrl.js',
      'src/js/controllers/contactCtrl.js',
      'src/js/controllers/creatorCtrl.js',
      'src/js/services/API.js',
      'src/js/services/utils.js'
    ],
    css: [
      'src/css/libs/bootstrap.min.css',
      'src/css/app.css',
      'src/css/libs/font-awesome.min.css'

    ],
    fonts: [
      'src/fonts/**/*.{ttf,woff,eof,svg,woff2,otf,eot}'
    ],
    img: 'src/**/*.{jpg,png,ico}'
  },
  dist: 'dist',
  distClient: 'dist/',
  distApp: 'dist/app',
  distFonts: 'dist/app/fonts',
  distViews: 'dist/views'
};

gulp.task('clean', function(done) {
  return del([PATHS.dist], done);
});

gulp.task('js', function() {
  return gulp
    .src(PATHS.client.js)
    .pipe(changed(PATHS.distApp, {
      extension: '.js'
    }))
    .pipe(concat('ohcopy.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(PATHS.distApp))
});
gulp.task("countdown", function(){
  return gulp    
    .src("src/js/libs/countdown.min.js")
    .pipe(gulp.dest(PATHS.distApp));
})
gulp.task('fonts', function() {
  return gulp
    .src(PATHS.client.fonts)
    .pipe(gulp.dest(PATHS.distFonts));
});

gulp.task('views', function() {
  return gulp
    .src(PATHS.client.views)
    .pipe(gulp.dest(PATHS.distViews));
});

gulp.task('html', function() {
  return gulp
    .src(PATHS.client.mainhtml)
    .pipe(gulp.dest(PATHS.distClient));
});

gulp.task('css', function() {
  return gulp
    .src(PATHS.client.css)
    .pipe(changed(PATHS.distClient, {
      extension: '.css'
    }))
    .pipe(minifyCSS())
    .pipe(concat('ohcopy.min.css'))
    .pipe(gulp.dest(PATHS.distApp));
});

gulp.task('img', function() {
  return gulp
    .src(PATHS.client.img)
    .pipe(changed(PATHS.distClient))
    .pipe(gulp.dest(PATHS.distApp));
});

gulp.task('bundle', function(done) {
  runSequence('clean', 'countdown', 'js','html','views', 'css', 'img','fonts', 'demon',done);
});

gulp.task('watch', function () {
  gulp.watch(assets, ['js', 'css', 'views']);
});

gulp.task('demon', function () {
  nodemon({
    script: 'server.js',
    ext: 'js',
    env: {
      'NODE_ENV': 'development'
    }
  })
    .on('start', ['watch'])
    .on('change', ['watch'])
    .on('restart', function () {
      console.log('restarted!');
    });
});

// Default Task
gulp.task('default', ['bundle']);