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

var argv = require('minimist')(process.argv.slice(4));

var withBower = false;
if(gutil.env.withbower === true) {
    withBower = true;
}

var withNpm = false;
if(gutil.env.withnpm === true) {
    withNpm = true;
}

if (withBower) {
    gulp.task('default', [
        "clean",
        "build:bower"
    ]);
}
else if (withNpm) {
    gulp.task('default', [
        "clean",
        "build:npm"
    ]);
}
else {
    gutil.log("No env use with bower or npm  !");
}

gulp.task("clean", function () {
    return gulp.src(targetdir, {read: false})
        .pipe(debug({title: ':clean'}))
        .pipe(clean());
});

gulp.task('build:bower', ['build:bower:normalize', 'build:bower:uglify', 'build:bower:dependencies']);
gulp.task('build:npm',   ['build:npm:normalize'  , 'build:npm:uglify'  , 'build:npm:dependencies']);

gulp.task('build:bower:normalize',    ["clean"], function() {
    
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
gulp.task('build:bower:uglify',       ["build:bower:normalize"], function () {
    return gulp.src('./bower_dependencies/js/' + '*.js')
		.pipe(uglify())
                .pipe(debug({title: ':uglify'}))
		.pipe(gulp.dest('./bower_dependencies/js-min/'));
});
gulp.task('build:bower:dependencies', ["build:bower:uglify"], function () {
	
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

gulp.task('build:npm:normalize',     ['clean'], function() {
 
});
gulp.task('build:npm:uglify',        ['build:npm:normalize'], function() {
    
});
gulp.task('build:npm:dependencies',  ['build:npm:uglify'], function() {
    
});