const express = require('express');
const router = express.Router();
const he = require("he");
const mongoose = require('mongoose');
const cheerio = require('cheerio');


const User = require('../models/User')
const Comment = require('../models/Comment')
const Post = require('../models/Post')
const React = require('../models/React')



router.get("/searchuser/:key", async (req, res) => {
    try {
      const regex = new RegExp(req.params.key, 'i'); // 'i' flag for case-insensitive search
  
      const userData = await User.find({
        username: { $regex: regex }
      });
  
     
      res.json(userData); // Sending the retrieved data as JSON response
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred during the search." });
    }
  });
  
  router.get("/searchpost/:key", async (req, res) => {
    try {
      // Fetch all the data
      const allData = await Post.find({ isDeleted: false });
  
      // Sanitize the content to remove HTML tags
      const sanitizedData = allData.map((post) => ({
        ...post._doc,
        content: cheerio.load(post.content).text()
      }));
  
      // Filter the sanitized data based on the regex
      const regex = new RegExp(req.params.key, 'i'); // 'i' flag for case-insensitive search
      const postData = sanitizedData.filter((post) => (
        regex.test(post.title) || regex.test(post.content)
      ));
  
      res.json(postData); // Sending the retrieved data as JSON response
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred during the search." });
    }
  });
  
  router.get('/searchcomment/:key', async (req, res) => {
    try {
      const parentPostID = req.params.key;
  
      // Perform the necessary logic to retrieve the post title based on the parentPostID
      // For example:
      const post = await Post.findOne({ _id: parentPostID });
      if (post) {
        const postTitle = post.title;
        res.json({ post });
      } else {
        res.status(404).json({ error: 'Post not found.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while searching for the post.' });
    }
  });
  
  
  
  
module.exports = router;