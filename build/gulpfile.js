var gulp      = require('gulp');
var clean     = require('gulp-clean');
var gutil     = require('gulp-util');
var normalize = require('gulp-bower-normalize');
var bower     = require('main-bower-files');
var debug     = require('gulp-debug');
var runtask   = require('gulp-bower');

// system file...
var fs = require('fs');

var targetdir = "./target";

var bDownload = false;
if(gutil.env.download === true) {
    bDownload = true;
}

gulp.task('default', [
    "clean",
    "download",
    "normalize",
    "build"
]);

// nettoyage du repertoire de "build"
gulp.task("clean", function () {
    return gulp.src(targetdir, {read: false})
        .pipe(debug({title: ':clean'}))
        .pipe(clean());
});

// recuperation des dependances via "bower" 
gulp.task('download', ["clean"], function() {
    
     if (bDownload) {
        return runtask();
    }
    
    gutil.log("SKIP Task : download !");
});

// normalisation des noms de dependances issu de "bower"
gulp.task('normalize', ["download"], function() {
    
    // les dependances doivent être placées dans le répertoire : target/build/js/external/
    // avec la possibilité d'utilisé une version minifiée ou non (cf. --dev)
    // Il faut normaliser les nons des lib., cad on ne veut pas de *.min.js !
    // Attention, il est possible qu'il n'y ait pas de lib. à normaliser...

    fs.exists('./bower_components', function (exist) {
        if (exist) {
            gulp.src(bower(), {base: './bower_components'})
		.pipe(debug({title: ':bower_components'}))
                .pipe(normalize({bowerJson: './bower.json', flatten:true}))
                .pipe(gulp.dest('./bower_dependencies/'));
        }
        else {
            gutil.log("No bower components !");
        }
    });
    
});

// copie
gulp.task('build', ["normalize"], function () {
    
    return gulp.src('./bower_dependencies/js/' + '*.js')
	.pipe(debug({title: ':build'}))
        .pipe(gulp.dest(targetdir));
});

