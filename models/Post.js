const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  title: String,
  content: String,
  author: String,
  rating: {type: Number, default: 0},
  userReaction: {type: Number, default: 0},
  createDate: {type: Date, default: Date.now()},
  editDate: {type: Date, default: null},
  isDeleted: {type: Boolean, default: false}
}, {versionKey: false}
);

const Post = mongoose.model('post', PostSchema);

module.exports = Post;
