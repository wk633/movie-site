var express = require('express');
var jade = require('jade');
var mongoose = require('mongoose');
var bluebird = require('bluebird')
var morgan = require('morgan');

const session = require('express-session')
const MongoStore = require('connect-mongo')(session)


// 静态资源请求路径
var path = require('path');
var bodyParser= require('body-parser');

var app = express();
var port = process.env.PORT || 3100;
const dbURL = 'mongodb://localhost:27017/movie';


app.locals.moment = require('moment'); // 在jade模版list中用了moment

mongoose.Promise = bluebird;
// movie为mongodb的一个数据库
mongoose.connect(dbURL)

// 设定视图文件的目录
app.set('views', './views/pages');
app.set('view engine', 'jade');

// 静态资源请求路径
app.use(express.static(path.join(__dirname, 'public/')));

// 表单数据格式化
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // 必须设为true否则body里的层级对象无法深度解析

// session持久化
app.use(session({
  secret: 'heiheihei',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    url: dbURL,
    collection: 'mysession'
  })
}))

if('development' === app.get('env')){
  console.log('process.env.server_ENV: ', process.env.server_ENV)
  console.log('app.get("env")', app.get('env'))
  console.log('in development environment')
  app.set('showStackError', true)
  app.use(morgan(':method :url :status'))
  mongoose.set('debug', true)
}

app.use(function(req, res, next){
  var _user = req.session.user
  app.locals.user = _user
  return next()
})

require('./config/routes')(app)


// 监听端口
app.listen(port);
console.log('using gulp-express, server started on port: ' + port);
