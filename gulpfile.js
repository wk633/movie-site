var gulp = require('gulp');
var server = require('gulp-express');

gulp.task('server', function(){
  server.run(['app.js']);

  // restart the server when app.js changes
  gulp.watch(['app.js', 'public/js/*.js','schemas/*.js','models/*.js'], server.run)
  gulp.watch(['views/**/*.jade'], server.notify);
})

gulp.task('default',['server'])
