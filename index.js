//To DO

//patch, delete post
//post, patch, delete comment
//add reaction patch/remove reaction in database

//SEMI-Done
//post post -> fix links and formatting, also should show delete  button for the user that posts the post
//patch profile -> need to fix profile pic, also displaying of posts in /profile (idk why it broke)

//DONE FOR SURE
// login, signup, logout

require('dotenv').config();
const link = process.env.DB_URL;
const authRoutes = require('./sessions/router');
const { isLoggedInMiddleware } = require('./lib/middleware');
const { userIDMiddleware } = require('./lib/middleware');
const express = require('express');
const session = require('express-session');
const ejs = require('ejs-async');
const MongoStore = require('connect-mongodb-session')(session);
const app = express();

const store = new MongoStore({
  uri: link,
  collection: 'sessions'
});


const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.set("view engine", "ejs")
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  name: process.env.SesNAME,
  secret: process.env.SesSECRET,
  httpOnly: true,
  secure: true,
  resave: false,
  maxAge: 1000 * 60 * 60 * 24, //1d day
  saveUninitialized: true,
  store: store
}));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));


const mongoose = require('mongoose');
mongoose.connect(link)
    .then(()=>console.log('Connected to server!'))
    .catch((error) => console.error('Connection error:', error));
const port = process.env.PORT 
app.listen(port, ()=>{
  console.log(`Listening to Port ${port}`)
});

const User = require('./models/User')
const Comment = require('./models/Comment')
const Post = require('./models/Post')
const React = require('./models/React')



app.use(isLoggedInMiddleware);
app.use(userIDMiddleware);
app.get("/index", async (req, res) => {
  try {
    if (req.session?.isLoggedIn) {
      console.log(req.sessionID);
      console.log(req.session.isLoggedIn);
      const userId = req.session.userId;
      console.log(userId);
      const posts = await Post.find().limit(0);

      // Get the number of positive and negative votes for each post
      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        const positiveCount = await React.countDocuments({ parentPostID: post._id, voteValue: 1 });
        const negativeCount = await React.countDocuments({ parentPostID: post._id, voteValue: -1 });
        const ratingCount = positiveCount - negativeCount;
        post.rating = ratingCount;
      }

      res.render("index", { posts });
    } else {
      console.log("Currently not logged in, showing a limited number of posts!")
      const limit = 20; // Change the limit value as needed
      const posts = await Post.find().limit(limit);
      
      // Get the number of positive and negative votes for each post
      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        const positiveCount = await React.countDocuments({ parentPostID: post._id, voteValue: 1 });
        const negativeCount = await React.countDocuments({ parentPostID: post._id, voteValue: -1 });
        const ratingCount = positiveCount - negativeCount;
        post.rating = ratingCount;
      }

      // Render the index template with the limited posts data
      res.render("index", { posts });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching posts." });
  }
});


app.get("/index", (req, res)=>{
    res.render("index")
})

app.get("/register", (req, res)=>{
  res.render("register")
})
app.get("/success", (req, res)=>{
  res.render("success")
})
app.get("/login", (req, res)=>{
  res.render("login")
})
app.get("/logout", (req, res)=>{
  req.session.destroy();
  console.log("not logged in");
  res.render("logout")
})

// app.get("/profile", async(req, res) =>{
//   username =
//   res.render("/profile/" + username);
// })

app.get("/profile/edit/", async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);
    console.log("app.get profile edit username: ", user.username);
    res.render("profile-edit", { user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching user information." });
  }
});

app.get("/editPost", (req, res)=>{
  res.render("editPost")
})

app.get("/newComment", (req, res)=>{
  res.render("newComment")
})

app.get("/editComment", (req, res)=>{
  res.render("editComment")
})




//logging in
app.post("/login", async (req, res) => {
  try {
    const { username, password, remember } = req.body;
    const user = await User.findOne({ username });

    // Check if the user exists and the password matches
    if (!user || user.password !== password) {
      return res.status(400).json({ error: "Invalid username or password." });
    }
    if (!user._id) {
      return res.status(500).json({ error: "An error occurred while retrieving user ID." });
    }
    req.session.isLoggedIn = true;

    req.session.userId = user._id;
    console.log("user id of session: ", req.session.userId)
    if (remember) {
      // Set a longer expiration time for the session cookie
      console.log(remember)
      req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 21; // 21 days
    }else{
      req.session.cookie.expires = null; //idk why it doesnt work lol
    }
    //res.redirect("/index");
    res.redirect("/profile");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while logging in." });
  }
});

app.post("/logout", async (req, res) => {
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

//registering
app.post("/api/user", async (req, res) => {
  try {
    const { username, password, repassword } = req.body;
    if (password !== repassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists." });
    }
    
    const user = new User({ username, password });
    const savedUser = await user.save();
    
    // Assign the user's ID to the userId field
    
    savedUser.userId = savedUser._id;
    await savedUser.save();

    res.redirect("/success");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while saving the user." });
  }
});



app.get("/success", (req, res) => {
  // Render the success page
  res.render("success");
});

let user, posts;

app.get("/profile", async (req, res) => {
  try {
    if (req.session.isLoggedIn) {
      // Fetch user information from MongoDB based on the logged-in user's ID
      
      const userId = req.session.userId;
      console.log(userId);
      user = await User.findById(userId);
      posts = await Post.find({ userID: userId, isDeleted:false })
      console.log("session id: ", req.sessionID);
      //console.log("profile of ", user.username);
      console.log(posts !== null);
      
      console.log(posts);
      if(posts.length === 0){
        user.posts = user.posts;
      }
      else{
        user.posts = posts;
      }
      
      console.log(userId);
      console.log(user);
      // Render the profile page with the user's information
      res.render("profile", { user });
    } else {
      // Redirect to the login page if not logged in
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching user information." });
  }
});

app.get("/profile/:username", async (req, res) => {
  try {
    if (req.session.isLoggedIn) {
      // Fetch user information from MongoDB based on the logged-in user's ID
      const { username } = req.params;
      user = await User.findOne({ username });
      userId = user._id;
      console.log("viewing profile of: ", userId, " with username: ", username);
      posts = await Post.find({ userID: userId, isDeleted:false })
      console.log(posts);
      if(posts.length === 0){
        user.posts = user.posts;
      }
      else{
        user.posts = posts;
      }
      
      console.log(userId);
      console.log(user);
      // Render the profile page with the user's information
      res.render("profile", { user });
    } else {
      // Redirect to the login page if not logged in
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching user information." });
  }
});

// app.patch("/api/user/:username", async(req, res) =>{
//   try {
//       userID = req.session.userID;
//       const updateData = await User.findByIdAndUpdate(userID, req.body, {new:true,})
//       res.json(updateData)
    
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "An error occurred while updating the profile." });
//   }
// });

app.patch('/api/user/:username', async (req, res) => {
  try {
    if (req.session.isLoggedIn) {
      const username = req.params.username;
      const newUsername = req.body.username;
      const newPassword = req.body.password;
      const updateData = req.body;
      if (newPassword !== "" && req.body.password === req.body.repassword) {
        // If the new password is provided, hash and update the password field
        updateData.password = newPassword;
      }else{
        delete updateData.password;
      }
      console.log(username);
      // Assuming you want to find the user by the username
      const user = await User.findOneAndUpdate({ username }, updateData, { new: true });
      await Post.updateMany({ author: username }, { author: newUsername });
      await Comment.updateMany({ author: username }, { author: newUsername });

      if (user) {
        // User found and updated successfully
        return res.json(user);
        //return res.redirect("/profile");
      } else {
        // User not found, return appropriate response
        return res.status(404).json({ error: 'User not found' });
      }
    }else{
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while updating the profile' });
  }
});


// app.patch("/api/user/:id", async(req, res) =>{
//   try {
//     if (req.session.isLoggedIn) {
//       if (req.body._method === "PATCH") {
//         //const { username, photo, aboutme, password ,repassword } = req.body;
//         const { username} = req.body;
//         // Fetch the user information from the database
//         const userId = req.session.userId;
//         const user = await User.findById(userId);

//         user.username = username;
//         // user.aboutme = aboutme;
//         // user.password = password;
//         // user.photo = photo;

//         await user.save();

//         // Redirect back to the profile page
//         res.redirect("/profile/" + user.username);
//         //res.redirect("/index");
//       }else {
//         res.status(400).json({ error: "Invalid request method." });
//       }
//     } else {
//       // Redirect to the login page if not logged in
//       res.redirect("/login");
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "An error occurred while updating the profile." });
//   }
// });

//new post (save to db)
app.post("/api/post", async(req, res) =>{
  try {
    if (req.session.isLoggedIn) {
        const userId = req.session.userId;
        const user = await User.findById(userId);
        const { title, content, createDate } = req.body;

          // Create a new post object
        const newPost = new Post({
          userID: user._id,
          title,
          content,
          author: user.username,
          createDate,
        });

      // Save the new post object to the database
      await newPost.save();
        res.redirect("/index");
    } else {
      // Redirect to the login page if not logged in
      //also shud display a message "you need to login first!"
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while updating the profile." });
  }
})

app.get("/post/:title", async (req, res) => {
  try {
    if (req.session.isLoggedIn) {
      const title = req.params.title;
      //currently logged in user
      const userId = req.session.userId;
      const user = await User.findById(userId);
      // Retrieve the post from the database based on the title
      const post = await Post.findOne({ title });

      if (!post) {
        return res.status(404).json({ error: "Post not found." });
      }
      //author of the post
      const author = await User.findOne({ username: post.author });
      const positiveCount = await React.countDocuments({ parentPostID: post._id, voteValue: 1 });
      const negativeCount = await React.countDocuments({ parentPostID: post._id, voteValue: -1 });
      const ratingCount = positiveCount - negativeCount;
      post.rating = ratingCount;
      let isCurrUserTheAuthor = author.username === user.username;

      res.render("post", { user, post, author, isCurrUserTheAuthor });
    } else {
      // Redirect to the login page if not logged in
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while retrieving the post." });
  }
});

//UNTESTED


app.post("/api/comment", async (req, res) => {
  try {
    if (req.session.isLoggedIn) {
      const userId = req.session.userId;
      const user = await User.findById(userId);
      const { content, parentPostId, parentCommentId } = req.body;

      //To Add: get the parent post and parent comment
      // Create a new comment object
      const newComment = new Comment({
        userID: user._id,
        content,
        parentPost: parentPostId, // Add the parent post if available
        parentComment: parentCommentId, // Add the parent comment if available
      });

      // Save the new comment object to the database
      await newComment.save();
      res.redirect(`/post/${encodeURIComponent(title)}`);
    } else {
      // Redirect to the login page if not logged in
      // Also, display a message "you need to login first!"
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while creating the comment." });
  }
});
