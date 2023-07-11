const mongoose = require('mongoose');
const ReactSchema = new mongoose.Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  parentPostID:{ type: mongoose.Schema.Types.ObjectId, ref: 'post'},
  parentCommentID:{ type: mongoose.Schema.Types.ObjectId, ref: 'comment'}, 
  isVoted: Boolean,
  voteValue: Number
}, {versionKey: false}
);

const React = mongoose.model('react', ReactSchema);

module.exports = React;
