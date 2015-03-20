var gulp      = require('gulp');
var clean     = require('gulp-clean');
var gutil     = require('gulp-util');
var normalize = require('gulp-bower-normalize');
var bower     = require('main-bower-files');
var debug     = require('gulp-debug');
var uglify    = require('gulp-uglify');

// system file...
var fs = require('fs');

var targetdir = "./target";

gulp.task('default', [
    "clean",
    "build:normalize",
    "build:uglify",
    "build:dependencies"
]);

// nettoyage du repertoire de "build"
gulp.task("clean", function () {
    return gulp.src(targetdir, {read: false})
        .pipe(debug({title: ':clean'}))
        .pipe(clean());
});

// normalisation des noms de dependances issu de "bower"
gulp.task('build:normalize', ["clean"], function() {
    
    fs.exists('./bower_components', function (exist) {
        if (exist) {
            return gulp.src(bower(), {base: './bower_components'})
		.pipe(debug({title: ':bower_components'}))
                .pipe(normalize({bowerJson: './bower.json', flatten:true}))
                .pipe(gulp.dest('./bower_dependencies/'));
        }
        else {
            gutil.log("No bower components !");
        }
    });
    
});

gulp.task('build:uglify', ["build:normalize"], function () {
    return gulp.src('./bower_dependencies/js/' + '*.js')
		.pipe(uglify())
                .pipe(debug({title: ':uglify'}))
		.pipe(gulp.dest('./bower_dependencies/js-min/'));
});

// copie
gulp.task('build:dependencies', ["build:uglify"], function () {
	
    fs.exists('./bower_dependencies', function (exist) {
        if (exist) {
		    return gulp.src('./bower_dependencies/js-min/' + '*.js')
			.pipe(debug({title: ':build'}))
			.pipe(gulp.dest(targetdir));
        }
        else {
            gutil.log("No bower dependencies !");
        }
    });
    			
});

