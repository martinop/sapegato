var mongoose = require('mongoose');
var likesPlugin = require('mongoose-likes');

var postSchema = new mongoose.Schema({
  title: String,
  urlTitle: String,
  description: String,
  mediaType: String,
  source: String,
  category: String,
  files: [String],
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  tags: [String],
  state: {type: String, default: "audit"},
  date: {type: Date, default: Date.now },
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

postSchema.plugin(likesPlugin);
postSchema.pre('save', function(next, inserted) {
  var user = this;
  next();
});


module.exports = mongoose.model('Post', postSchema);