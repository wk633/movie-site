var Comment = require('../models/comment')

exports.save = function(req, res) {
	var _comment = req.body.comment;
  var movieId = _comment.movie
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
