const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  content: String,
  createDate: Date,
  isDeleted: Boolean
}, {versionKey: false}
);

const Post = mongoose.model('post', PostSchema);

module.exports = Post;
