const express = require('express');
const router = express.Router();
const he = require("he");
const mongoose = require('mongoose');

const User = require('../models/User')
const Comment = require('../models/Comment')
const Post = require('../models/Post')
const React = require('../models/React')

router.get("/profile", async (req, res) => {
    try {
      if (req.session.isLoggedIn) {
        let user, posts, comments;
        const userId = req.session.userId;
        //console.log(userId);
        user = await User.findById(userId);
        posts = await Post.find({ userID: userId, isDeleted:false });
        comments = await Comment.find({ userID: userId, isDeleted:false });
        let sortOrder = 'desc'
        posts.sort((a, b) => (sortOrder === "desc" ? b["createDate"] - a["createDate"] : a["createDate"] - b["createDate"]));
        comments.sort((a, b) => (sortOrder === "desc" ? b["createDate"] - a["createDate"] : a["createDate"] - b["createDate"]));
        if(posts.length === 0){
          user.posts = user.posts;
        }
        else{
          user.posts = posts;
        }
        if(comments.length === 0){
          user.comments = user.comments;
        }
        else{
          for (const comment of comments) {
            const parentPost = await Post.findById(comment.parentPostID);
            comment.parentPostTitle = parentPost ? parentPost.title : "Unknown Post Title";
          }
          user.comments = comments;
        }
        
        posts.forEach(post =>{
          post.content = he.decode(post.content);
          post.title = he.decode(post.title);
        })
        comments.forEach(comment => {
          let temp = he.decode(comment.content);
          comment.content = temp;
        })
        const decodedAboutMe = he.decode(user.aboutme);
        user.aboutme = decodedAboutMe;
  
        //console.log(userId);
        //console.log(user);
        let IsCurrUserTheProfileOwner = true;
        res.render("profile", { he, user, IsCurrUserTheProfileOwner});
      } else {
        res.redirect("/login");
      }
    } catch (error) {
      console.error(error);
      return res.status(500).render("fail", { error: "That user does not exist." });
    }
  });
  
router.get("/profile/:username", async (req, res) => {
    try {
      //if (req.session.isLoggedIn) {
        //logged in user info
        //const userLoggedIn = User.findById(req.session.userId);
        let  posts, comments;
        const { username } = req.params;
        let user = await User.findOne({ username });
        const userId = user._id;
        //console.log(req.session.userId.toString(), " ", userId.toString())
  
        let IsCurrUserTheProfileOwner = false;
        if(req.session.userId != null && req.session.userId.toString() === userId.toString()){
          IsCurrUserTheProfileOwner = true;
          res.redirect("/profile");
        }
        
        console.log("viewing profile of: ", userId, " with username: ", username);
        posts = await Post.find({ userID: userId, isDeleted:false })
        comments = await Comment.find({ userID: userId, isDeleted:false });
        
        let sortOrder = 'desc'
        posts.sort((a, b) => (sortOrder === "desc" ? b["createDate"] - a["createDate"] : a["createDate"] - b["createDate"]));
        console.log(posts);
        if(posts.length === 0){
          user.posts = user.posts;
        }
        else{
          user.posts = posts;        
        }
        if(comments.length === 0){
          user.comments = user.comments;
        }
        else{
          for (const comment of comments) {
            const parentPost = await Post.findById(comment.parentPostID);
            comment.parentPostTitle = parentPost ? parentPost.title : "Unknown Post Title";
          }
          user.comments = comments;
        }
  
        posts.forEach(post =>{
          post.content = he.decode(post.content);
          post.title = he.decode(post.title);
        })
        comments.forEach(comment => {
          let temp = he.decode(comment.content);
          comment.content = temp;
        })
        
        const decodedAboutMe = he.decode(user.aboutme);
        user.aboutme = decodedAboutMe;
  
        console.log(userId);
        console.log(user);
        // Render the profile page with the user's information
        res.render("profile", { he, user, IsCurrUserTheProfileOwner });
    } catch (error) {
      console.error(error);
      //res.status(500).json({ error: "An error occurred while fetching user information." });
      return res.status(500).render("fail", { error: "That user does not exist." });
    }
  });
  
  
router.get("/editprofile", async (req, res) => {
    try {
      const userId = req.session.userId;
      const user = await User.findById(userId);
      console.log(user);
      res.render("profile-edit", { user, error: null });
    } catch (error) {
      console.error(error);
      res.status(500).render("fail", { error: "An error ocurred while fetching user information." });
      //res.status(500).json({ error: "An error occurred while fetching user information." });
    }
  });
  
router.post("/editprofile", async (req, res) => {
    try {
      if (req.session.isLoggedIn) {
        const userID = req.session.userId;
        let user = await User.findById(userID);
        //console.log("profile edit", user);
        const username = user.username;
        const newUsername = req.body.username;
        let newPassword = req.body.password;
        const updateData = req.body;
        newPassword = newPassword.toString();
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}$/; 
        if(username === newUsername){
          delete updateData.username;
        }else{
          let tempUser = await User.findOne({username: newUsername})
            if(tempUser){
              return res.status(300).json({error: "Username has already been taken. Choose a different username."})
            }
        }
 
        if(newPassword !== "" && !passwordRegex.test(newPassword)){
          console.log("invalid new password");
          return res.status(400).json( {  error: "Passwod should be at least 6 characters long, and containing only alphanumeric characters"});
        }
        if (((newPassword !== "") && (req.body.password === req.body.repassword))) {
          console.log("valid new password")
          updateData.password = newPassword;
        }else{
          console.log("no new password")
          delete updateData.password;
          delete updateData.repassword;
          req.session.expires = null;
        }
  
        let usernameRegex = /^(?=.{3,15}$)(?=.*[a-zA-Z0-9])[a-zA-Z0-9_-]*$/;
        if (!usernameRegex.test(newUsername) || newUsername.toLowerCase() === "visitor") {
          return res.status(401).json( { error: "Username must contain at least one letter or number, and be between 3-15 characters long, and cannot be 'visitor!"});
        }
  
        // let aboutmeRegex = /^[a-zA-Z0-9\t\n\r\s]*(?![\x22\x27])/;
        // if (!aboutmeRegex.test(req.body.aboutme)) {
        //   return res.status(402).json( { error: "About me cannot contain quotation marks!"});
        // }
        console.log(updateData);
        user = await User.findOneAndUpdate({ username: username }, updateData, { new: true });
        await Post.updateMany({ author: username }, { author: newUsername });
        await Comment.updateMany({ author: username }, { author: newUsername });
  
        if (user) {
          return res.json(user);
        } else {
          return res.status(404).json( { error: "User not found"});
        }
      }else{
        res.redirect("/login");
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while updating the profile' });
      let user = User.schema;
      return res.status(500).render("profile-edit", { user, error: "An error occurred while updating the profile"});
    }
  });

  module.exports = router;