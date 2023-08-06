const express = require('express');
const router = express.Router();
const he = require("he");
const mongoose = require('mongoose');

const User = require('../models/User')
const Comment = require('../models/Comment')
const Post = require('../models/Post')
const React = require('../models/React')



//new comment
router.post("/api/comment", async (req, res) => {
    try {
      if (req.session.isLoggedIn) {
        const userId = req.session.userId;
        const user = await User.findById(userId);
        let { content, parentPostID, parentCommentID } = req.body;
        console.log("parent post id as string:", parentPostID);
        let parentPostIdObject = new mongoose.Types.ObjectId(parentPostID); //converts the string representation parentPostID to mongoose id
        let parentCommentIdObject = null;
        const currentDate = new Date();
        if(parentCommentID){
          parentCommentIdObject = new mongoose.Types.ObjectId(parentCommentID);
        }
        console.log("parent post id as object: ", parentPostIdObject)
        const masterPost = await Post.findById(parentPostIdObject); //gets master post of the comment, no matter the depth
        console.log("Master post object: ", masterPost);
        // Create a new comment object
        content = content.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n(?=.)/g, "<br>");
        const newComment = new Comment({
          userID: user._id,
          author: user.username,
          content,
          createDate:currentDate,
          parentPostID: parentPostIdObject, // Add the parent post if available
          parentCommentID: parentCommentIdObject, // Add the parent comment if available
        });
  
        // Save the new comment object to the database
        await newComment.save();
        console.log("YES!");
        let data = {
            pauthor: newComment.author,
            ppfp: user.photo,
            pdesc: content, 
            pcount: 0,
            pid: newComment._id,
            user: user,
            parentID: newComment.parentPostID,
            isLoggedIn: true, 
            preactValue: 0,
            createDate: currentDate,
            editDate: '',
            parentCommentID: newComment.parentCommentID,
        }
        console.log(data.parentID);
        res.json({ message: 'Comment posted successfully', data });
        //res.redirect(`/post/${encodeURIComponent(masterPost._id)}`);
      } else {
        // Redirect to the login page if not logged in
        // Also, display a message "you need to login first!"
        res.redirect("/login");
      }
    } catch (error) {
      console.error(error);
      //res.status(500).json({ error: "An error occurred while creating the comment." });
      res.status(500).render("fail", { error: "An error occurred while creating the comment." });
    }
  });
  
  //edit and delete comments
router.patch("/api/comment/:id", async (req, res) => {
    try {
      const commentId = req.params.id;
      //Fetches the comment
      const comment = await Comment.findById(commentId, {isDeleted:false});
      const user = await User.findById(req.session.userId)
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }
      // if (comment.userID.toString() != req.session.userId.toString()) {
      //   return res.status(403).json({ error: 'You are not authorized to edit this comment.' });
      // }
      console.log(comment)
      //Updating comment fields
      if (req.body.content) {
        content = req.body.content;
        content = content.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n(?=.)/g, "<br>");
        comment.content = content;
      }
  
      // Check if the 'isDeleted' field exists in the request body
      // If it does, update the 'isDeleted' field in the post
      if (req.body.isDeleted !== undefined) {
        comment.isDeleted = req.body.isDeleted;
      }
  
      comment.editDate = Date.now();
  
      // Save the updated post in the database
      await comment.save();
      
      res.json({ message: "Comment updated successfully", comment });
    } catch (error) {
      console.error(error);
      //res.status(500).json({ error: "Server error" });
      res.status(500).render("fail", { error: "Comment not found." });
    }
  });


  router.get("/comment/:id", async (req, res) => {
    try {
      const commentId = req.params.id;
      const comment = await Comment.findOne({ _id: commentId }).populate("userID");
      //const commentAuthor = await User.findOne({username: comment.author});
      if (!comment) {
        return res.status(404).json({ error: "Comment not found." });
      }
      const post = await Post.findOne({ _id: comment.parentPostID });
      if (!post) {
        return res.status(404).json({ error: "Post not found." });
      }
  
      const isUserLoggedIn = req.session?.isLoggedIn;
      let user, reactValue, isCurrUserTheAuthor;
      const userId = req.session.userId;
      if (isUserLoggedIn) {
        
        user = await User.findById(userId);
        const react = await React.findOne({ userID: userId, parentPostID: post._id });
        reactValue = react ? react.voteValue : 0;
        isCurrUserTheAuthor = post.userID.toString() === userId;
      } else {
        user = { username: "visitor" }; // If user is not logged in, set a default user
        reactValue = 0;
        isCurrUserTheAuthor = false;
      }
      const postID = post._id;
      let decodedTitle = he.decode(post.title);
      let decodedContent = he.decode(post.content);
      post.title = decodedTitle;
      post.content = decodedContent;
      //const decodedTitle = he.decode(comment.title);
      decodedContent = he.decode(comment.content);
      //comment.title = decodedTitle;
      comment.content = decodedContent;
  
  
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
      comment.childComments = await fetchChildComments(comment);
      const userReaction = await React.findOne({
        userID: userId,
        parentCommentID: comment._id,
        isVoted: true,
      });
      comment.userReaction = userReaction ? userReaction.voteValue : 0;
      comment.content = he.decode(comment.content);
      const comments = [comment];
  
      //const author = await User.findOne({ username: comment.author });
      //const isCurrUserTheAuthor = author.username === user.username;
      const author = await User.findOne({ username: post.author });
      res.render("comment", { postID, user, post, author, isCurrUserTheAuthor, comments, reactValue });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error." });
    }
  });



module.exports = router;