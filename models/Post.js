const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  
  title: String,
  content: String,
  author: String,
  createDate: {type: Date, default: Date.now()},
  isDeleted: {type: Boolean, default: false}
}, {versionKey: false}
);

const Post = mongoose.model('post', PostSchema);

module.exports = Post;
