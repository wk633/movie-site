var Movie = require('../models/movie');
var _ = require('underscore');

exports.list =  function (req, res) {
    Movie.fetch(function (err, movies) {
        if (err) {
            console.log(err);
        }
        res.render('list', {title:'电影-列表', movies: movies});
    });
}

exports.detail =  function (req, res) {
    var id = req.params.id;

    Movie.findById(id, function (err, movie) {
        console.log(movie);
        res.render('detail', {title: '电影-详情', movie: movie});
    })
}

// 录入界面
exports.new = function (req, res) {
    res.render('new', {
      title: '电影-后台录入页',
      movie: {
        title: "",
        director: "",
        country: "",
        language: "",
        year: "",
        poster: "",
        summary: ""
      }
    });
}

// 逻辑控制:插入
exports.record =  function (req, res) {
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
}
// 逻辑控制:更新
exports.update =  function (req, res) {
    var id = req.params.id;

    if (id) {
        Movie.findById(id, function (err, movie) {
            res.render('new', {
                title: '后台更新页',
                movie: movie
            })
        })
    }
}
// 逻辑控制:删除
exports.delete =  function (req, res) {
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
}
