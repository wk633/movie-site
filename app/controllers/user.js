var User = require('../models/user.js');

exports.showSignup = function(request, response){
  response.render('signup', {
    title: '注册页面'
  })
}
exports.signup = function(request, response){
  var _user = request.body.user
  User.findOne({name: _user.name}).exec()
    .then(
      function(result){
        if(result){
          console.log(result)
          return response.redirect('/signin')
        }else{
          var user = new User(_user)
          user.save(function(err, user_saved){
            if(err){
              return response.json(err)
            }
            console.log(user_saved)
            return response.redirect('/')
          })
        }
      },
      function(err){
        return response.json(err)
      }
    )
}

exports.showSignin = function(request, response){
  response.render('signin', {
    title: '登录页面'
  })
}
exports.signin = function(request, response){
  var _user = request.body.user
  User
    .findOne({name: _user.name}).exec()
    .then(
      function(result){
        if(!result){
          console.log('用户不存在')
          return response.redirect('/signup')
        }

        result
        .checkPassword(_user.password)
        .then(
          function(isMathced){
            if(isMathced){
              console.log('password matched')
              request.session.user = result
              return response.redirect('/')
            }else{
              console.log('password not matched')
              return response.redirect('/signin')
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
}


exports.logout = function(req,res){
  delete req.session.user
  res.redirect('/')
}

exports.userlist = function (req, res) {
    User.fetch(function (err, users) {
        if (err) {
            console.log(err);
        }
        res.render('userlist', {title:'用户-列表', users: users});
    });
}
