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
  app.get('/admin/userlist', User.userlist)

  // movie
  app.get('/detail/:id', Movie.detail)
  app.get('/admin/new', Movie.new) // 录入界面
  app.get('/admin/update/:id', Movie.update)
  app.get('/admin/movie', Movie.record) // 录入提交
  app.get('/admin/list', Movie.list)
  app.delete('/admin/list', Movie.delete)

}
