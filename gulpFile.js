var gulp            = require('gulp');
var autoprefixer    = require('gulp-autoprefixer');
var browsersync     = require('browser-sync');
var browsyncinject  = require('gulp-browsersync-inject');
var concat          = require('gulp-concat');
var image           = require('gulp-image');
var imagemin        = require('gulp-imagemin');
var rename          = require('gulp-rename');
var replace         = require('gulp-replace');
var sass            = require('gulp-sass');
var sourcemaps      = require('gulp-sourcemaps');
var uglify          = require('gulp-uglify');
var watchs          = require('gulp-watch');

// Start Styles Function
async function styles() {
    return gulp.src('src/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle:'compressed'})).on('errer', sass.logError)
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(rename('main.min.css') )
    .pipe(gulp.dest('dist/css'))
    .pipe(browsersync.stream());
}// End Styles Function

// Start  bootstrap_styles Function
async function bootstrap_styles() {
    return gulp.src('src/bootstrap/bootstrap.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle:'compressed'})).on('errer', sass.logError)
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(rename('bootstrap.min.css') )
    .pipe(gulp.dest('dist/css'))
    .pipe(browsersync.stream());
}// End  bootstrap_styles Function

// Start Styles Function
async function vendor_styles() {
    return gulp.src('src/paugins/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(concat('vendor.min.css'))
    .pipe(gulp.dest('dist/css/vendor'))
    .pipe(browsersync.stream());
}// End Styles Function

// Start Scripts Function
async function scripts() {
    return gulp.src('src/js/**/*.js')
    .pipe(uglify())
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(browsersync.stream());
}// End Scritps Function

// Start Scripts Function
async function vendor_scripts() {
    return gulp.src('src/plugins/**/*.js')
    .pipe(uglify())
    .pipe(concat('vendor.min.js'))
    .pipe(gulp.dest('dist/js/vendor'))
    .pipe(browsersync.stream());
}// End Scritps Function

async function compress_images() {
    return gulp.src('src/images/**/*.*')
    .pipe(imagemin([
        imagemin.gifsicle({ interlaced: true }),
        // imagemin.jpegtran({ progressive: true }), // old
        imagemin.mozjpeg({ progressive: true }), // new
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
            plugins:[
                { removeViewBox: true },
                { cleanupIDs: false }
            ]
        })
    ]))
    .pipe(gulp.dest('dist/images'))
    .pipe(browsersync.stream());
}

// Start Watch Function
function watch() {
    browsersync.init({
        server:{
            baseDir:'./'
        }
    });
    gulp.watch('src/scss/**/*.scss',styles);
    gulp.watch('src/bootstrap/**/*.scss',bootstrap_styles);
    gulp.watch('src/plugins/**/*.css',vendor_styles);
    gulp.watch('src/js/**/*.js',scripts);
    gulp.watch('src/plugins/**/*.js',vendor_scripts);
    gulp.watch('src/images/**/*.*',compress_images);
    gulp.watch('./*.html').on('change', browsersync.reload);
    gulp.watch('./pages/**/*.html').on('change', browsersync.reload);
}// End Watch Function

exports.default = gulp.series(
    
    gulp.parallel([styles, bootstrap_styles]),
    gulp.parallel([scripts, vendor_scripts, vendor_styles]),
    compress_images,
    watch
) 