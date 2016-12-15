var _ = require('underscore');
var Movie = require('../models/movie');
var User = require('../models/user.js');


var emptyMovie = {
    title: "",
    director: "",
    country: "",
    language: "",
    year: "",
    poster: "",
    summary: ""
};

// 路由
module.exports = function(app){
  // 用户界面
  app.get('/', function (req, res) {
    console.log('user in session')
    console.log(req.session.user)

    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('index', {title:'电影-首页', movies: movies});
    });
  });
  app.get('/list', function (req, res) {
      Movie.fetch(function (err, movies) {
          if (err) {
              console.log(err);
          }
          res.render('list', {title:'电影-列表', movies: movies});
      });
  });
  app.get('/detail/:id', function (req, res) {
      var id = req.params.id;

      Movie.findById(id, function (err, movie) {
          console.log(movie);
          res.render('detail', {title: '电影-详情', movie: movie});
      })
  });

  // 录入界面
  app.get('/admin/new', function (req, res) {
      res.render('new', {title: '电影-后台录入页', movie: emptyMovie});
  });



  // sign up
  app.post('/user/signup', function(request, response){
    var _user = request.body.user
    User.findOne({name: _user.name}).exec()
      .then(
        function(result){
          if(result){
            console.log(result)
            return response.json({
              "errHint": "username duplicate"
            })
          }else{
            var user = new User(_user)
            user.save(function(err, user_saved){
              if(err){
                return response.json(err)
              }
              console.log(user_saved)
              return response.redirect('/admin/userlist')
            })
          }
        },
        function(err){
          return response.json(err)
        }
      )
  })

  app.post('/user/signin', function(request, response){
    var _user = request.body.user
    User
      .findOne({name: _user.name}).exec()
      .then(
        function(result){
          if(!result){
            console.log('用户不存在')
            return response.json({
              'errHint': 'user does not exist'
            })
          }
          result
          .checkPassword(_user.password)
          .then(
            function(isMathced){
              if(isMathced){
                console.log('password matched')
                request.session.user = result
                return response.json({
                  Matched: true
                })
              }else{
                console.log('password not matched')
                return response.json({
                  Matched: false
                })
              }
            },
            function(err){
              return response.json(err)
            }
          )
        },
        function(err){
          return response.json(err)
        }
      )
  })

  app.get('/logout', function(req,res){
    delete req.session.user
    res.redirect('/')
  })

  app.get('/admin/userlist', function (req, res) {
      User.fetch(function (err, users) {
          if (err) {
              console.log(err);
          }
          res.render('userlist', {title:'用户-列表', users: users});
      });
  });

  // 逻辑控制:插入
  app.post('/admin/control/new', function (req, res) {
      var movieObj = req.body.movie;
      var id = movieObj._id;
      var _movie;
      if (id !== 'undefined') {
          Movie.findById(id, function (err, movie) {
              if (err) {
                  console.log(err);
              }
              _movie = _.extend(movie, movieObj);
              _movie.save(function (err, movie) {
                  if (err) {
                      console.log(err);
                  }

                  res.redirect('/detail/' + movie._id);
              });
          });
      } else {
          _movie = new Movie({
              director: movieObj.director,
              title: movieObj.title,
              country: movieObj.country,
              language: movieObj.language,
              year: movieObj.year,
              poster: movieObj.poster,
              summary: movieObj.summary,
              flash: movieObj.flash
          });
          _movie.save(function (err, movie) {
              if (err) {
                  console.log(err);
              }

              res.redirect('/detail/' + movie._id);
          });
      }
  });
  // 逻辑控制:更新
  app.get('/admin/control/update/:id', function (req, res) {
      var id = req.params.id;

      if (id) {
          Movie.findById(id, function (err, movie) {
              res.render('new', {
                  title: '后台更新页',
                  movie: movie
              })
          })
      }
  });
  // 逻辑控制:删除
  app.delete('/admin/control/delete', function (req, res) {
      var id = req.query.id;

      if (id) {
          Movie.remove({_id: id}, function (err, movie) {
              if (err) {
                  console.log(err);
              } else {
                  res.json({success: true});
              }
          });
      }
  });
}
