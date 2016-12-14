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
    var self = this
    console.log(self)
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    } else {
        this.meta.updateAt = Date.now();
    }
    bcrypt.genSalt(10, function(err,salt){
      if(err){
        console.log(err)
      }
      bcrypt.hash(self.password, salt, function(err, hash){
        self.password = hash
        next()
      })
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
