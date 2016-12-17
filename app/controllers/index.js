var Movie = require('../models/movie');
var Category = require('../models/category');

exports.index = function(req, res){
  Category
  .find({})
  .populate({path: 'movies', options: {limit: 4}})
  .exec()
  .then(
    function(doc){
      console.log('doc:')
      console.log(doc.length)
      console.log(doc)
      res.render('index', {
        title: '电影网 首页',
        categories: doc
      })
    },
    function(err){console.log(err)}
  )
}

exports.search = function(req, res){
  // 分页测试 http://localhost:3200/results?category_id=5855350d8dac3461dcd6a00a&page=0
  var category_id = req.query.category_id
  var page = req.query.page
  var index = page * 4
  Category
  .find({_id: category_id})
  .populate({
    path: 'movies',
    options: {limit: 4, skip: index}})
  .exec()
  .then(
    function(categories){
      var category = categories[0] || {}
      console.log('movies under this category')
      console.log(category.movies)
      res.render('results', {
        title: '搜索结果页面',
        keyword: category.name,
        category: category
      })
    },
    function(err){console.log(err)}
  )
}
