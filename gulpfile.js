// gulpfile.js
var gulp  = require('gulp'),
    browserSync = require('browser-sync').create(),
    htmlmin = require('gulp-htmlmin'),
    nunjucksRender = require('gulp-nunjucks-render'),
    version = require('gulp-version-number'),
    sass = require("gulp-sass");

const PATHS = {
    output: 'dist',
    srcpath: 'src',
    templates: 'src/templates',
    pages: 'src/pages',
}
const versionConfig = {
    'value': '%MDS%',
    'append': {
        'key': 'v',
        'to': ['css', 'js'],
    },
};

// writing up the gulp nunjucks task
gulp.task('nun', function() {
    console.log('Rendering nunjucks files..');
    return gulp.src(PATHS.pages + '/**/*.+(html|njk)')
        .pipe(nunjucksRender({
          path: [PATHS.templates],
          watch: true,
        }))
        .pipe(version(versionConfig))
        .pipe(gulp.dest(PATHS.output));
});

gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: PATHS.output
        },
    });
});

gulp.task('watch', function() {
    // trigger Nunjucks render when pages or templates changes
    // File support for .html .njk .js .css
    gulp.watch([PATHS.pages + '/**/*.+(njk)', PATHS.templates + '/**/*.+(njk)'], gulp.series('nun'));
    gulp.watch([PATHS.srcpath + '/sass/*.sass'], gulp.series('sass'));
    // reload browsersync when `dist` changes
    gulp.watch([PATHS.output + '/**/*.*']).on('change', browserSync.reload);
});

gulp.task('minify', function() {
  return gulp.src(PATHS.output + '/*.html')
    .pipe(htmlmin({
        collapseWhitespace: true,
        cssmin: true,
        jsmin: true,
        removeOptionalTags: true,
        removeComments: false
    }))
    .pipe(gulp.dest(PATHS.output));
});

// recompile bulma from the nodes_module folder to dist/assets/css/bulma.css
gulp.task('bulma', function () {
    return gulp.src('node_modules/bulma/bulma.sass')
    .pipe(sass( {outputStyle: 'compressed'}))
    .pipe(gulp.dest(PATHS.output + '/assets/css'));
});

gulp.task('sass', function () {
    return gulp.src(PATHS.srcpath + '/sass/*.sass')
    .pipe(sass( {outputStyle: 'compressed'}))
    .pipe(gulp.dest(PATHS.output + '/assets/css'));
});

// run browserSync auto-reload together with nunjucks auto-render
gulp.task('auto', gulp.series(gulp.parallel('browserSync', 'watch'), function() {} ));

//default task to be run with gulp
gulp.task('default', gulp.series('nun'), function() {});