var mongoose = require('mongoose');
var likesPlugin = require('mongoose-likes');

var commentSchema = new mongoose.Schema({
  author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  text: String,
  date: {type: Date, default: Date.now },
});
commentSchema.add({
	comments: [commentSchema],
})
commentSchema.plugin(likesPlugin);
commentSchema.pre('save', function(next, inserted) {
  var user = this;
  next();
});


module.exports = mongoose.model('Comment', commentSchema);