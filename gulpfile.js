var gulp = require('gulp');
var server = require('gulp-express');

gulp.task('server', function(){
  server.run(['app.js']);

  // restart the server when app.js changes
  gulp.watch(['app.js', 'public/js/*.js','app/**/*.js', 'config/routes.js'], server.run)
  gulp.watch(['app/views/**/*.jade'], server.notify);
})

gulp.task('default',['server'])
