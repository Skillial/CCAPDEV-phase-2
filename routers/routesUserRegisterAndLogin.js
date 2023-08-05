const express = require('express');
const router = express.Router();
const he = require("he");
const mongoose = require('mongoose');

const User = require('../models/User')
const Comment = require('../models/Comment')
const Post = require('../models/Post')
const React = require('../models/React')



//logging in
router.post("/login", async (req, res) => {
    try {
      console.log("does req.session not exist?", !req.session.isLoggedIn);
      if(!req.session.isLoggedIn){
        let { username, password, remember } = req.body;
        console.log(username);
        const user = await User.findOne({ username: username });
        if (!user) {
          console.log("asdasd");
          return res.status(400).json({ error: "That user does not exist." });
        }
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch ) {
          return res.status(400).json({ error: "Wrong Username or Password." });
        }
  
        req.session.isLoggedIn = true;
        req.session.userId = user._id;
        if (!remember) {
          console.log("no remember!");
          //req.expires = false;
          //req.session.expires=false;
          req.session.cookie.expires = false;
        }
        req.session.rememberMe = remember;
        res.redirect("/profile");
      }
      else{
        res.redirect("/profile");
      }
    } catch (error) {
      console.error(error);
      
      return res.status(500).json({ error: "DB error." });
    }
  });
  
  router.post("/logout", async (req, res) => {
    try {
        req.session.destroy();
        req.session.isLoggedIn=false;
        res.redirect("/logout");
    } catch (err) {
        console.error('Error logging out:', err);
        return next(new Error('Error logging out'));
    }
    
    res.status(200).send();
  })
  
  
  router.post("/register", async (req, res) => {
    try {
      const { username, password, repassword } = req.body;
  
      if (password !== repassword) {
        return res.status(400).json({ error: "Passwords do not match." });
      }
  
      //checking inputs for other stuff
      const MIN_PASSWORD_LENGTH = 6; 
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/; 
      if (password.length < MIN_PASSWORD_LENGTH || !passwordRegex.test(password)) {
        return res.status(400).json({ error: "Password must be at least 6 characters long and must contain upper and lowercase lettes, and numbers." });
      }
  
      let usernameRegex = /^(?=.{3,15}$)(?=.*[a-zA-Z0-9])[a-zA-Z0-9_-]*$/;
      if (!usernameRegex.test(username) || username.toLowerCase() === "visitor") {
        return res.status(400).json( { error: "Username must contain at least one letter or number, and be between 3-15 characters long, and cannot be 'visitor'!" });
      }
      
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json( { error:"Username already exists"});
      }
  
      const user = new User({ username, password });
      const savedUser = await user.save();
  
      savedUser.userId = savedUser._id;
      await savedUser.save();
  
      res.redirect("/success");
    } catch (error) {
      console.error(error);
      return res.status(505).json( { error: "An error occured, please try again" });
    }
  });



// Server-side route to clear the session
router.post("/clear-session", (req, res) => {
  try {
    // Clear the session (destroy the session)
    req.session.destroy((error) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to clear the session." });
      } else {
        res.sendStatus(200);
        console.log("Session destroyed.")
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error." });
  }
});





module.exports = router;  