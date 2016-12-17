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
  var query = req.query.query
  var page = parseInt(req.query.page, 10) || 0
  const itemsPerPage = 4
  var index = page * itemsPerPage

  if(category_id){
    // 如果有分类id，则执行分类／分页
    var _category = Category.findOne({_id: category_id})
    _category.exec()
    .then(
      function(category){
        var totalPage = category.movies.length
        _category
        .populate({
          path: 'movies',
          options: {limit: itemsPerPage, skip: index}})
          .exec()
          .then(
            function(category){
              res.render('results', {
                title: '搜索结果页面',
                keyword: category.name,
                movies: category.movies,
                currentPage: page,
                query: 'category_id=' + category._id,
                totalPage: Math.ceil(totalPage/itemsPerPage)
              })
            },
            function(err){console.log(err)}
          )
        },
        function(err){console.log(err)}
      )
  }
  else {
    // 执行电影搜索，来自搜索框
    Movie
    .find({title: query}, null, {limit: itemsPerPage, skip: index}).exec()
    .then(
      function(movies){
        res.render('results', {
          title: '搜索结果页面',
          keyword: query,
          query: 'query='+query,
          currentPage: page,
          totalPage: 1,
          movies: movies
        })
      },
      function(err){console.log(err)}
    )
  }


}
