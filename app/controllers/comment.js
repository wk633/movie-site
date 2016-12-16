var Comment = require('../models/comment')

exports.save = function(req, res) {
	var _comment = req.body.comment;
  var movieId = _comment.movie
	console.log('_comment: ')
	console.log(_comment)
	
	if(_comment.cid){
		// 表示是回复给某个评论的
		Comment.findById(_comment.cid, function(err, comment){
			if(err) {
				console.log(err)
			}
			var replay = {
				from: _comment.from, // 自己的id
				to: _comment.tid, // 被点击头像的人的id
				content: _comment.content
			}
			comment.reply.push(replay)
			comment
				.save()
				.then(
					function(){
						res.redirect('/movie/' + movieId)
					},
					function(err){
						console.log(err)
					}
				)
		})
	}else{
		var comment = new Comment(_comment)
		comment
		.save()
		.then(
			function(doc){
				console.log('comment saved')
				console.log(doc)
				res.redirect('/movie/' + movieId)
			},
			function(err){
				console.log(err)
			}
		)
	}
}
