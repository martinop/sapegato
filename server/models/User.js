var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true, 
    sparse: true,
    lowercase: true, 
    trim: true
  },
  password: {
    type: String,
    select: false
  },
  name: String,
  email: String,
  picture: String,
  cover: {type: String, default: "http://www.chavez.org.ve/wp-content/gallery/cabezal/chavez-por-siempre-19.jpg"},
  facebook: String,
  twitter: String,
  google: String,
  country: String,
  city: String,
  permission: String,
  username_twitter: String,
  username_facebook: String,
  username_instagram: String
});

userSchema.pre('save', function(next, inserted) {
  var user = this;
  next();
});


module.exports = mongoose.model('User', userSchema);