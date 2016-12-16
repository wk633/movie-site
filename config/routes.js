var Index = require('../app/controllers/index')
var User = require('../app/controllers/user')
var Movie = require('../app/controllers/movie')

// 路由
module.exports = function(app){

  // pre handle user
  app.use(function(req, res, next){
    app.locals.user = req.session.user

    next()
  })

  // index page
  app.get('/', Index.index)

  // user
  app.post('/user/signup', User.signup)
  app.post('/user/signin', User.signin)
  app.get('/signup', User.showSignup)
  app.get('/signin', User.showSignin)
  app.get('/logout', User.logout)
  app.get('/admin/userlist', User.signinRequired, User.adminRequired, User.userlist)

  // movie
  app.get('/detail/:id', Movie.detail)
  app.get('/admin/movie/new',User.signinRequired, User.adminRequired, Movie.new) // 录入界面
  app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired ,Movie.update)
  app.post('/admin/movie',User.signinRequired, User.adminRequired, Movie.record) // 录入提交
  app.get('/admin/list', User.signinRequired, User.adminRequired, Movie.list) // 查看用户
  app.delete('/admin/movie/delete', Movie.delete)

  // Comment


}
