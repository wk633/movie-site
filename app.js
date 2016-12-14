var express = require('express');
var jade = require('jade');
var mongoose = require('mongoose');
var bluebird = require('bluebird')
var _ = require('underscore');
var Movie = require('./models/movie');
var User = require('./models/user.js');

// 静态资源请求路径
var path = require('path');
var bodyParser= require('body-parser');

var app = express();
var port = process.env.PORT || 3100;
app.locals.moment = require('moment'); // 在jade模版list中用了moment

mongoose.Promise = bluebird;
// movie为mongodb的一个数据库
mongoose.connect('mongodb://localhost:27017/movie')

// 设定视图文件的目录
app.set('views', './views/pages');
app.set('view engine', 'jade');

// 静态资源请求路径
app.use(express.static(path.join(__dirname, 'public/')));

// 表单数据格式化
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // 必须设为true否则body里的层级对象无法深度解析


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
// 用户界面
app.get('/', function (req, res) {
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
app.post('/user/signup', function(req, res){
  var _user = req.body.user
  var response = res
  User.find({name: _user.name}, function(err,result){
    if(err){
      return response.json(err)
    }
    if(result.length > 0) {
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
  })
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

// 监听端口
app.listen(port);
console.log('using gulp-express, server started on port: ' + port);
