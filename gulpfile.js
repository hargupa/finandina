const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const prefix = require('gulp-autoprefixer');
const minifyCss = require('gulp-clean-css');
const cssmin = require('gulp-cssmin');

var config = {
    vendorCssSrc: [
		'css/simuladorvehiculos.min.css',
		//'node_modules/bootstrap/dist/css/bootstrap.min.css',
		'node_modules/angular-ui-grid/ui-grid.min.css',
		'node_modules/angular-material/angular-material.min.css',
        'node_modules/jquery-ui-dist/jquery-ui.min.css',
        'node_modules/angular-datatables/dist/css/angular-datatables.min.css',
        'node_modules/datatables/media/css/jquery.dataTables.min.css',
		'node_modules/angular-ui-grid/fonts/ui-grid.ttf',
		'node_modules/angular-ui-grid/fonts/ui-grid.eot',
		'node_modules/angular-ui-grid/fonts/ui-grid.woff'
    ],
    vendorScriptSrc: [
		'node_modules/jquery/dist/jquery.min.js',
		'node_modules/angular/angular.min.js',
		'node_modules/angular-aria/angular-aria.min.js',
		'node_modules/angular-animate/angular-animate.min.js',
		'node_modules/bootstrap/dist/js/bootstrap.min.js',
		'node_modules/angular-messages/angular-messages.min.js',
		'node_modules/angular-ui-grid/ui-grid.min.js',
		'node_modules/angular-ui-grid/i18n/ui-grid.language.es.min.js',
		'node_modules/angular-material/angular-material.min.js',
        'node_modules/jquery-ui-dist/jquery-ui.min.js',
        'node_modules/angular-datatables/dist/angular-datatables.min.js',
        'node_modules/datatables/media/js/jquery.dataTables.min.js',
        'node_modules/angular-chart.js/dist/angular-chart.min.js',
        'node_modules/chart.js/dist/Chart.min.js',
        'node_modules/angular-i18n/angular-locale_es-es.js'
    ]
}
gulp.task('vendorCss', function () {

    return gulp.src(config.vendorCssSrc)
		.pipe(gulp.dest('dist/vendor/css'));
});

gulp.task('vendorScripts', function () {

    return gulp.src(config.vendorScriptSrc)
        .pipe(gulp.dest('dist/vendor/js'));
});

gulp.task('sass', function () {
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(prefix({ browsers: ['last 4 version'] }))
        .pipe(minifyCss())
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./css/'));
});

gulp.task('JsCompiler', () => {
    return gulp.src('./src/js/**/*.js')
		.pipe(babel({
		    presets: ['@babel/env'], "plugins": ["@babel/plugin-transform-typeof-symbol"]
		}))
		.pipe(uglify())
		.pipe(rename({
		    suffix: '.min'
		}))
		.pipe(gulp.dest('./js/'));
});

gulp.task('watch', (done) => {
    gulp.watch('./src/sass/**/*.scss', gulp.parallel(['sass']));
    gulp.watch('./src/js/**/*.js', gulp.parallel(['JsCompiler']));
    done();
});

gulp.task('default', gulp.series('sass', 'JsCompiler', 'vendorCss', 'vendorScripts'), function () {

    console.log('Compiled complete');
});
