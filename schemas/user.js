var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var MovieSchema = new mongoose.Schema({
    name: {
      type: String,
      unique: true
    },
    password: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

MovieSchema.pre('save', function (next) {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    bcrypt.hash('bacon', 10, function(err, hash){
      if(err) {
        console.log('err at user.js: ')
        console.log(err)
      }
      this.password = hash;
      next()
    })
});

MovieSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb);
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb);
    }
};

module.exports = MovieSchema;
