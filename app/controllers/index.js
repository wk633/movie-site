var Movie = require('../models/movie');
var Category = require('../models/category');

exports.index = function(req, res){
  Category
    .find({})
    .populate({path: 'movies', options: {limit: 5}})
    .exec()
    .then(
      function(doc){
        res.render('index', {
          title: 'imooc 首页',
          categories: doc
        })
      },
      function(err){console.log(err)}
    )

  Movie.fetch(function (err, movies) {
      if (err) {
          console.log(err);
      }
      res.render('index', {title:'电影-首页', movies: movies});
  });
}
