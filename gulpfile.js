var gulp = require('gulp'),
    rename = require('gulp-rename'),
    embedTemplates = require('gulp-angular-embed-templates'),
    cleanCSS = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    del = require("del"),
    concat = require("gulp-concat"),
    gzip = require("gulp-gzip"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    project = require('./package.json'),
    cssimport = require("gulp-cssimport"),
    angularFilesort = require("gulp-angular-filesort");

var paths = {
    src: {
        scss:'src/**/*.scss',
        js:'src/**/*.js',
        html:'src/**/*.html'
    },
    dist: './dist'
};

var ignoreError = false;

//just copies and minifies the css files from src to dist
gulp.task('css', function() {
    return gulp.src(paths.src.scss)
        //import any externally linked vendor css files (only import css, scss will be imported automatically)
        //do this first to keep everything scoped inside correctly
        .pipe(cssimport({extensions: ["css"]}))
        //convert scss files to css
        .pipe(sass.sync()).on('error', sass.logError)
        //adds prefixes to css fields to manage cross browser support for newer css features
        .pipe(postcss([ autoprefixer({ browsers: ['last 2 versions'] }) ]))
        //merge all css files into one css library
        .pipe(concat(project.name + ".css"))
        //write out css file
        .pipe(gulp.dest(paths.dist))
        //minify
        .pipe(cleanCSS()).on('error', stopError) 
        .pipe(rename({extname: ".min.css"}))
        //write out min.css file
        .pipe(gulp.dest(paths.dist))
        //gzip min.css
        .pipe(gzip({append: true}))
        //write out min.css.gz file
        .pipe(gulp.dest(paths.dist));
});

//compiles js files minifies and copies to dist
gulp.task('js', function() {
    return gulp.src(paths.src.js)
        //embeds the templateUrl html files for directives directly into the js files
        //this is required to package the module correctly
        .pipe(embedTemplates()).on('error', stopError)
        //sorts the angular files
        //added this because the gulp task seemed to randomly order the files
        //which caused a git diff in the dist/*.js files even if there was no real change
        .pipe(angularFilesort())
        //merge all js files into one js library
        .pipe(concat(project.name + ".js"))
        //write out js file
        .pipe(gulp.dest(paths.dist))
        //minify
        .pipe(uglify()).on('error', stopError) 
        .pipe(rename({extname: ".min.js"}))
        //write out min.js file
        .pipe(gulp.dest(paths.dist))
        //gzip min.js
        .pipe(gzip({append: true}))
        //write out min.js.gz file
        .pipe(gulp.dest(paths.dist));
});

//clears the distribution folder
gulp.task("clean", function() {
    return del(paths.dist);
});

//by default cleans the distribution folder then re compiles
gulp.task('default', ['clean'], function(){
    return gulp.start(['css', 'js']);
});

//will update the distribution files automatically when they change
gulp.task('watch', ['default'], function() {
    //allow watch to keep running if an error occurs
    ignoreError = true;
    //watch for changes in scss files and rerun css task
    gulp.watch(paths.src.scss, ['css']);
    //watch for changes in js files and rerun js task
    gulp.watch([paths.src.js, paths.src.html], ['js']);
});

//stops errors from crashing gulp watch 
//use .on('error', stopError) after pipe event
function stopError (error) {
    console.log(error.toString());
    if (ignoreError) {
        this.emit('end');
    }
}
