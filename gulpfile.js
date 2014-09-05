var gulp = require("gulp"),
    uglify = require('gulp-uglify'),
    //jsdoc = require('gulp-jsdoc'),
    concat = require('gulp-concat'),
    webserver = require('gulp-webserver'),


    src = 'jquery.p2r.js',
    doc = 'doc/',
    dest = 'jquery.p2r.min.js';







gulp.task('serve', function () {
    gulp.src('test')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
        }));
});




gulp.task('default', function () {

    gulp.src(src)
        .pipe(uglify())
        .pipe(concat(dest))
        .pipe(gulp.dest('./'))

    // gulp.src(src)
    //     .pipe(jsdoc.parser())
    //     .pipe(jsdoc.generator('./docx/'))
    //.pipe(gulp.dest('./doc/'))

});