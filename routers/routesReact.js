//server side for handling reactions
const express = require('express');
const router = express.Router();
const he = require("he");
const mongoose = require('mongoose');

const User = require('../models/User')
const Comment = require('../models/Comment')
const Post = require('../models/Post')
const React = require('../models/React')

router.post('/api/react', async (req, res) => {
    try {
      if (req.session.isLoggedIn) {
        const userId = req.session.userId;
        const user = await User.findById(userId);
        const parentId = req.body.parentId;
        const reactParentType = req.body.reactParentType;
        const reactionValue = req.body.reactionValue;
        let post = Post.schema, comment = Comment.schema;
        let existingReact;
        if(reactParentType == 'post'){
          post = await Post.findById(parentId);
          if (!post) {
            return res.status(404).json({ error: 'Post not found' });
          }
          existingReact = await React.findOne({ userID: userId, parentPostID: parentId });
        }else{
          comment = await Comment.findById(parentId);
          if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
          }
          existingReact = await React.findOne({ userID: userId, parentCommentID: parentId });
        }
        //console.log("parent id: ", parentId);
        //console.log("parent info: ", post," ", comment)
        let oldReactValue;
        if (existingReact) {
          // User has already reacted, update the voteValue
          oldReactValue = existingReact.voteValue;
          existingReact.voteValue = reactionValue;
          if(reactionValue == 0){
            existingReact.isVoted = false;
          }else{
            existingReact.isVoted = true;
          }
          await existingReact.save();
        } else {
          // User has not reacted, create a new React document
          let newReact;
          if(reactParentType == 'post'){
            newReact = new React({
              userID: userId,
              parentPostID: parentId,
              isVoted: true,
              voteValue: reactionValue
            });
          }else{
            newReact = new React({
              userID: userId,
              parentCommentID: parentId,
              isVoted: true,
              voteValue: reactionValue
            });
          }
          await newReact.save();
        }
        let updatedRatingCount;
        if(reactParentType == 'post'){
          // const positiveCount = await React.countDocuments({ parentPostID: parentId, voteValue: 1 });
          // const negativeCount = await React.countDocuments({ parentPostID: parentId, voteValue: -1 });
          // const ratingCount = positiveCount - negativeCount;
          
          const post = await Post.findById(parentId);
          let ratingCount = post.rating || 0;
          //let updatedRatingCount;
  
          if(oldReactValue && oldReactValue == -1){
            if(reactionValue == 0){
              updatedRatingCount = ratingCount + 1;
            }
            else{
              updatedRatingCount = ratingCount + 2;
            }
          } else if (oldReactValue && oldReactValue == 1){
            if(reactionValue == 0){
              updatedRatingCount = ratingCount - 1;
            }
            else{
              updatedRatingCount = ratingCount - 2;
            }
          }else {
            if(reactionValue == 1){
              updatedRatingCount = ratingCount + 1;
            }
            else{
              updatedRatingCount = ratingCount - 1;
            }
          }
  
          await Post.findOneAndUpdate(
            { _id: parentId, rating: ratingCount }, // Query: Find the post with the specific ratingCount
            { rating: updatedRatingCount }, // Update: Set the new rating count
            { new: true } // Options: Return the updated document after the update
          );
          }
        else{
          //slow way ;-;
          // const positiveCount = await React.countDocuments({ parentCommentID: parentId, voteValue: 1 });
          // const negativeCount = await React.countDocuments({ parentCommentID: parentId, voteValue: -1 });
          // const ratingCount = positiveCount - negativeCount;
          const comment = await Comment.findById(parentId);
          let ratingCount = comment.rating || 0;
          //let updatedRatingCount;
          if(oldReactValue && oldReactValue == -1){
            if(reactionValue == 0){
              updatedRatingCount = ratingCount + 1;
            }
            else{
              updatedRatingCount = ratingCount + 2;
            }
          } else if (oldReactValue && oldReactValue == 1){
            if(reactionValue == 0){
              updatedRatingCount = ratingCount - 1;
            }
            else{
              updatedRatingCount = ratingCount - 2;
            }
          }else {
            if(reactionValue == 1){
              updatedRatingCount = ratingCount + 1;
            }
            else{
              updatedRatingCount = ratingCount - 1;
            }
          }
          await Comment.findOneAndUpdate(
            { _id: parentId, rating: ratingCount }, // Query: Find the post with the specific ratingCount
            { rating: updatedRatingCount }, // Update: Set the new rating count
            { new: true } // Options: Return the updated document after the update
          );
        }
        //await newReact.save();
        req.session.cachedPosts = []; 
        req.session.cachedNoUpdate = false;
        console.log(updatedRatingCount);
        res.json({ message: 'Reaction updated successfully', newRatingValue: updatedRatingCount });
      } else{
        res.redirect("/login");
      }
    }catch (error) {
      console.error(error);
      //res.status(500).json({ error: 'Server error' });
      res.status(500).render("fail", { error: "Server error." });
    }
  });
  
  

  module.exports = router;  