var gulp = require("gulp"),
	rename = require("gulp-rename"),
	browserSync = require("browser-sync"),
	reload = browserSync.reload,
	uglify = require("gulp-uglify");

gulp.task("server", function(){
	browserSync({
		server:{
			baseDir: "app"
		}
	})
});

gulp.task("html",function(){
	gulp.src("src/*.html")
	.pipe(gulp.dest("app/"))
	.pipe(reload({stream: true}));
});

gulp.task("scripts", function(){
	gulp.src("src/js/*.js")
	.pipe(gulp.dest("app/js"))
	.pipe(reload({stream:true}));
});

gulp.task("scripts-uglify", function(){
	gulp.src("src/js/*.js")
	.pipe(uglify())
	.pipe(rename({
		suffix: ".min"
	}))
	.pipe(gulp.dest("app/js"))
	.pipe(reload({stream:true}));
});

gulp.task("css", function () {
	gulp.src("src/css/*.css")
	.pipe(gulp.dest("app/css/"))
	.pipe(reload({stream: true}));
})

gulp.task("watch", function(){
	gulp.watch("src/*.html",["html"]);
});


gulp.task("default",["server","html","scripts", "scripts-uglify", "css", "watch"]);