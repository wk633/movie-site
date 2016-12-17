var Movie = require('../models/movie');
var Comment = require('../models/comment');
var Category = require('../models/category');
var _ = require('underscore');

exports.list = function(req, res) {
	Movie.fetch(function(err, movies) {
		if (err) {
			console.log(err);
		}
		res.render('list', {
			title: '电影-列表',
			movies: movies
		});
	});
}

exports.detail = function(req, res) {
	var id = req.params.id;

	Movie
	.findOne({_id: id})
	.populate('category','name _id')
	.exec()
	.then(
		function(movie){
			console.log('movie in movie.js:')
			console.log(movie);
			Comment
				.find({movie: id})
				.populate('from','name') // 只返回User的name
				.populate('reply.from reply.to', 'name')
				.exec() // 执行query，并返回一个promise对象
				.then(
					function(doc){
						console.log('doc in movie.js: ')
						console.log(doc)
						res.render('detail', {
							title: '电影详情页',
							movie: movie,
							comments: doc
						})
					},
					function(err){console.log(err)}
				)
		},
		function(){}
	)
}

// 录入界面
exports.new = function(req, res) {
	Category
		.find({})
		.then(
			function(doc){
				res.render('new', {
					title: '电影-后台录入页',
					categories: doc,
					movie: {}
				});
			},
			function(err){console.log(err)}
		)

}

// 逻辑控制:插入
exports.record = function(req, res) {
		var movieObj = req.body.movie;
		console.log('movieObj: ')
		console.log(movieObj)
		var id = movieObj._id;
		var _movie;
		if (id) {
			// 电影已经存在，更新记录的逻辑
			Movie.findById(id, function(err, movie) {
				if (err) {
					console.log(err);
				}
				_movie = _.extend(movie, movieObj);
				_movie.save(function(err, movie) {
					if (err) {
						console.log(err);
					}
					// todo 修改分类信息
					res.redirect('/movie/' + movie._id);
				});
			});
		}
		else {
			// 是一部新电影，新建电影的逻辑
			_movie = new Movie(movieObj);
			var categoryId = movieObj.category
			var categoryName = movieObj.categoryName

			_movie
			.save()
			.then(
				function(movie){
					if(categoryId){
						// 选了数据库里的电影类型
						Category
						.findById({_id: categoryId})
						.then(
							function(doc){
								doc.movies.push(movie._id)
								doc
								.save()
								.then(
									function(){
										res.redirect('/movie/' + movie._id);
									},
									function(err){console.log(err)}
								)
							},
							function(err){console.log(err)}
						)
					}
					else if(categoryName){
						// 需要新建电影类型
						var category = new Category({
							name: categoryName,
							movies: [movie._id]
						})
						category
						.save()
						.then(
							function(category){
								// 再更新下该电影的分类
								movie.category = category._id
								movie
								.save()
								.then(
									function(doc){
										res.redirect('/movie/' + doc._id);
									},
									function(err){console.log(err)}
								)
							},
							function(err){console.log(err)}
						)
					}

				},
				function(err){console.log(err)}
			)
		}
	}
	// 逻辑控制:更新
exports.update = function(req, res) {
		var id = req.params.id;
		if (id) {
			Movie.findById(id, function(err, movie) {
				Category
					.find({})
					.then(
						function(doc){
							res.render('new', {
								title: '后台更新页',
								movie: movie,
								categories: doc
							})
						},
						function(err){console.log(err)}
					)
			})
		}
	}
	// 逻辑控制:删除
exports.delete = function(req, res) {
	var id = req.query.id;

	if (id) {
		Movie.remove({_id: id}, function(err, movie) {
			if (err) {
				console.log(err);
			} else {
				res.json({
					success: true
				});
			}
		});
	}
}
