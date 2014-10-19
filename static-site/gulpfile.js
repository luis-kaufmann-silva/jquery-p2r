var
    path = require('path'),
    gulp = require("gulp"),
    bower = require('gulp-bower'),
    twig = require("gulp-twig"),
    concat = require("gulp-concat"),
    rename = require("gulp-rename"),
    less = require("gulp-less"),
    autoprefixer = require("gulp-autoprefixer"),
    uglify = require("gulp-uglify");

var
    BOWER = 'bower_components/',
    LESS = './src/assets/less/*.less',
    JS = ['./src/assets/js/lib/*.js', './src/assets/js/*.js'],
    TEMPLATE = './src/templates/',
    STATIC = './src/assets/static/',
    DIST = path.join(__dirname, './dist');

var base_url = 'http://localhost:3000/';
// TODO assets manager
// var assets = 'http://localhost:3000/';


gulp.task('less', function _gulp_less() {
    return gulp.src(LESS)
        .pipe(less({
            compress: true
        }))
        .pipe(autoprefixer({
            browsers: ['last 100 versions'],
        }))
        .pipe(rename({
            suffix: ".min",
        }))
        .pipe(gulp.dest(path.join(DIST, 'static/css/')));
});

gulp.task('js', function _gulp_js() {
    return gulp.src(JS)
        .pipe(uglify())
        .pipe(rename({
            suffix: ".min",
        }))
        .pipe(gulp.dest(path.join(DIST, 'static/js/')))
});

gulp.task('twig-index', function _gulp_twig_index() {
    return gulp
        .src(path.join(TEMPLATE, "index.twig"))
        .pipe(twig({
            base: TEMPLATE,
            data: {
                base_url: base_url
            }
        }))
        .pipe(gulp.dest(DIST));
});

gulp.task('twig-pages', function _gulp_twig_pages() {
    gulp
        .src(path.join(TEMPLATE, "pages/") + '*.twig')
        .pipe(twig({
            base: TEMPLATE,
            data: {
                base_url: base_url
            }
        }))
        .pipe(gulp.dest(path.join(DIST, 'pages')));
});



gulp.task('bower', function _gulp_twig_pages() {
    gulp.src(path.join(STATIC, 'bower.json'))
        .pipe(gulp.dest(DIST));
    return bower({
            directory: './static/bower_components',
            cwd: DIST
        })
        .pipe(gulp.dest(DIST))

});


gulp.task('default', ['less', 'js', 'twig-index', 'twig-pages', 'bower']);