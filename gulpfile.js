var gulp = require('gulp');
// 压缩html
var htmlClean = require('gulp-htmlclean');
// 压缩图片
var imageMin = require('gulp-imagemin');
// 压缩js
var uglify = require('gulp-uglify');
// 去掉就是中的调试语句
var debug = require('gulp-strip-debug');
// 将less转换成css
var less = require('gulp-less');
// 压缩css
var cleanCss = require('gulp-cleancss');
// postcss autoprefixer
var postCss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
// 开启服务器
var connect = require('gulp-connect');

var folder = {
    src: 'src/',
    dist: 'dist/'
}

var devMode = process.env.NODE_ENV == 'development';

gulp.task('html', function () {
    var page = gulp.src(folder.src + 'html/*')
        .pipe(connect.reload())
    if (!devMode) {
        page.pipe(htmlClean()) // 压缩html
    }
    page.pipe(gulp.dest(folder.dist + 'html/'))
    return page;
});

gulp.task('image', function () {
    return gulp.src(folder.src + 'image/*')
        .pipe(imageMin()) // 压缩图片
        .pipe(gulp.dest(folder.dist + 'image/'))
});

gulp.task('css', function () {
    var page = gulp.src(folder.src + 'css/*')
        .pipe(connect.reload())
        .pipe(less()) // 将less转换成css
        .pipe(postCss([autoprefixer()]))
    if (!devMode) {
        page.pipe(cleanCss()) // 压缩css
    }
    page.pipe(gulp.dest(folder.dist + 'css/'));
    return page;
});

gulp.task('js', function () {
    var page = gulp.src(folder.src + 'js/*')
        .pipe(connect.reload())
    if (!devMode) {
        page
            // .pipe(debug()) // 去掉调试语句
            .pipe(uglify()) // 压缩js
    }
    page.pipe(gulp.dest(folder.dist + 'js/'));
    return page;
});

gulp.task('server', function () {
    connect.server({
        port: '8888',
        livereload: true
    })
});

gulp.task('watch', function () {
    gulp.watch(folder.src + 'html/*', gulp.series('html'));
    gulp.watch(folder.src + 'css/*', gulp.series('css'));
    gulp.watch(folder.src + 'js/*', gulp.series('js'));
});

gulp.task('default', gulp.series(gulp.parallel('html', 'css', 'js', 'image'), gulp.parallel('server', 'watch')));