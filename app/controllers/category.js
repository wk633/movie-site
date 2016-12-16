var Category = require('../models/category')

exports.new = function(req, res){
  res.render('category', {
    title: '电影分类录入',
    category: {
      name: ''
    }
  })
}

exports.save = function(req, res){
  var _category = req.body.category
  var category = new Category({
    name: _category.name
  })
  category
    .save()
    .then(
      function(doc){
        res.redirect('/admin/category/list')
      },
      function(err){console.log(err)}
    )

}

exports.list = function(req, res){
  Category
    .fetch()
    .then(
      function(doc){
        res.render('category_list', {
          title: '分类列表页',
          'categories': doc
        })
      },
      function(err){console.log(err)}
    )
}
