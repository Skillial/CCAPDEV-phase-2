const express = require('express');
const router = express.Router();
const he = require("he");
const mongoose = require('mongoose');

const User = require('../models/User')
const Comment = require('../models/Comment')
const Post = require('../models/Post')
const React = require('../models/React')


//new post (save to db)
router.post("/api/post", async (req, res) => {
    try {
      if (req.session.isLoggedIn) {
        const userId = req.session.userId;
        const user = await User.findById(userId);
        let { title, content } = req.body;
        title = title.replace(/'/g, "\\'").replace(/"/g, '\\"');
        content = content.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n(?=.)/g, "<br>");
  
        const newPost = new Post({
          userID: user._id,
          title,
          content,
          author: user.username,
          createDate: new Date(), 
        });
  
        req.session.cachedNoUpdate = false;
        await newPost.save();
        res.redirect("/index");
      } else {
        req.flash("error", "You need to login first!!");
        res.redirect("/login");
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "An error occurred while updating the profile." });
    }
  });
  
  
  router.get("/post/:id", async (req, res) => {
    try {
      const postId = req.params.id;
      const post = await Post.findOne({ _id: postId }).populate("userID");
      if (!post) {
        //return res.status(404).json({ error: "Post not found." });
        res.status(500).render("fail", { error: "Post not found." });
      }
  
      const isUserLoggedIn = req.session?.isLoggedIn;
      let user, reactValue, isCurrUserTheAuthor;
      const userId = req.session.userId;
      const author = await User.findOne({ username: post.author });
      if (isUserLoggedIn) {
        user = await User.findById(userId);
        const react = await React.findOne({ userID: userId, parentPostID: post._id });
        reactValue = react ? react.voteValue : 0;
        isCurrUserTheAuthor = post.userID._id.toString() === userId.toString();
        //console.log(post);
        console.log("are you author?", isCurrUserTheAuthor);
      } else {
        user = { username: "visitor" }; // If user is not logged in, set a default user
        reactValue = 0;
        isCurrUserTheAuthor = false;
      }
  
      const decodedTitle = he.decode(post.title);
      const decodedContent = he.decode(post.content);
      post.title = decodedTitle;
      post.content = decodedContent;
  
      // Fetch all top-level comments for the post
      const topLevelComments = await Comment.find({ parentPostID: post._id, parentCommentID: null })
        .populate("userID")
        .exec();
  
      // A recursive function to fetch comments of comments and so on
      async function fetchChildComments(comment) {
        const childComments = await Comment.find({ parentCommentID: comment._id })
          .populate("userID")
          .exec();
  
        if (childComments.length === 0) {
          return [];
        }
  
        const recursiveChildComments = await Promise.all(
          childComments.map(async (childComment) => {
            childComment.childComments = await fetchChildComments(childComment);
            const userReaction = await React.findOne({
              userID: userId,
              parentCommentID: childComment._id,
              isVoted: true,
            });
            childComment.userReaction = userReaction ? userReaction.voteValue : 0;
  
            const decodedContent = he.decode(childComment.content);
            childComment.content = decodedContent;
            return childComment;
          })
        );
  
        return recursiveChildComments;
      }
  
      // Fetch comments recursively for each top-level comment
      const comments = await Promise.all(
        topLevelComments.map(async (comment) => {
          comment.childComments = await fetchChildComments(comment);
          const userReaction = await React.findOne({
            userID: userId,
            parentCommentID: comment._id,
            isVoted: true,
          });
          comment.userReaction = userReaction ? userReaction.voteValue : 0;
  
          const decodedContent = he.decode(comment.content);
          comment.content = decodedContent;
          return comment;
        })
      );
      console.log("are you author?", isCurrUserTheAuthor);
      
      res.render("post", { post, user, author, isCurrUserTheAuthor, comments, reactValue });
    } catch (error) {
      console.error(error);
      res.status(500).render("fail", { error: "Post does not exist." });
    }
  });
  
  
  //edit post
  router.patch("/api/post/:id", async (req, res) => {
    try {
      const postId = req.params.id;
      // Fetch the post from the database based on the postId
      const post = await Post.findById(postId, {isDeleted:false});
      const user = await User.findById(req.session.userId)
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      if (post.userID.toString() != req.session.userId.toString()) {
        return res.status(403).json({ error: 'You are not authorized to edit this post.' });
      }
      console.log("is user the author? ", post.author != user.username, " ", post.author, " ", user.username);
      console.log("is user the author2? ", post.userID.toString() != req.session.userId.toString(), " ", post.userID.toString(), " ", req.session.userId.toString());
      // Update the post fields based on the data in the request body
      if (req.body.title) {
        title = req.body.title;
        title = title.replace(/'/g, "\\'").replace(/"/g, '\\"');
        post.title = title;
      }
  
      if (req.body.content) {
        content = req.body.content;
        content = content.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n(?=.)/g, "<br>");
        post.content = content;
      }
      
      // Check if the 'isDeleted' field exists in the request body
      // If it does, update the 'isDeleted' field in the post
      if (req.body.isDeleted !== undefined) {
        post.isDeleted = req.body.isDeleted;
      }
  
      post.editDate = Date.now();
  
      // Save the updated post in the database
      await post.save();
      req.session.cachedPosts = []; 
      req.session.cachedNoUpdate = false;
      res.json({ message: "Post updated successfully", post });
    } catch (error) {
      console.error(error);
      //res.status(500).json({ error: "Server error" });
      res.status(500).render("fail", { error: "Post editing failed." });
    }
  });

module.exports = router;