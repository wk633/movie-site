var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
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

UserSchema.pre('save', function (next) {
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
      console.log('salt is: ', salt)
      bcrypt.hash(self.password, salt, function(err, hash){
        self.password = hash
        console.log('password after hash is: ', hash)
        next()
      })
    })
});

UserSchema.methods = {
  checkPassword: function(_password){
    return bcrypt.compare(_password, this.password)
  }
}

UserSchema.statics = {
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

module.exports = UserSchema;
