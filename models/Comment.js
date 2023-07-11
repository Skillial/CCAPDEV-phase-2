const mongoose = require('mongoose');
const CommentSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  parentPostID:{ type: mongoose.Schema.Types.ObjectId, ref: 'post'}, //can be null?
  parentCommentID:{ type: mongoose.Schema.Types.ObjectId, ref: 'comment'}, 
  //can be null? but if both are null then surely we can just summarize comment and post into 1 js?
  //thhat would make react.js easier as well?
  content: String,
  createDate: Date,
  isDeleted: Boolean
  //if we summarize Post.js and Comment.js into one, uncomment next line:
  //comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }] 
  //pero having arrays is kinda bad?
}, {versionKey: false}
);

const Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;
