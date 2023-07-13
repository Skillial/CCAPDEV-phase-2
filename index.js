//To DO
//patch profile --> doesnt work
//patch, delete post
//post, patch, delete comment
//add reaction patch/remove reaction

//SEMI-Done
//login, signup, logout (mostly just need to fix landing pages, especially if kapag may error)
//post post -> needs links and implementation in homepage

require('dotenv').config();
const link = process.env.DB_URL;

const authRoutes = require('./sessions/router');
const { isLoggedInMiddleware } = require('./lib/middleware');
const express = require('express');
const session = require('express-session');
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
  maxAge: null,
  resave: false,
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




app.get("/index", async (req, res) => {
  if (req.session?.isLoggedIn) {
    console.log(req.sessionID);
    console.log(req.session.isLoggedIn);
    req.session.userId = User.userId;
    const posts = await Post.find().limit(0); 
    res.render("index", { posts });
    //res.render("index");
    //req.session.destroy();
  } else{
    //res.redirect('/login')
    console.log("Currently not logged in, showing a limited number of posts!")
    const limit = 20; // Change the limit value as needed
    const posts = await Post.find().limit(limit);
      
    // Render the index template with the limited posts data
    res.render("index", { posts });

  }
});
app.use(isLoggedInMiddleware);

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

app.get("/profile/edit/", async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);

    res.render("profile-edit", { user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching user information." });
  }
});

app.get("/newPost", (req, res)=>{
  res.render("newPost")
})

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
    req.session.isLoggedIn = true;

    if (!user._id) {
      return res.status(500).json({ error: "An error occurred while retrieving user ID." });
    }

    req.session.userId = user._id;

    if (remember) {
      // Set a longer expiration time for the session cookie
      console.log(remember)
      req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 21; // 21 days
    }
    
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


app.get("/profile", async (req, res) => {
  try {
    if (req.session.isLoggedIn) {
      // Fetch user information from MongoDB based on the logged-in user's ID
      const userId = req.session.userId;
      
      const user = await User.findById(userId);
      const posts = await Post.find({ userID: userId, isDeleted:false }).exec()
      user.posts = posts;
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

app.patch("/api/user/:username", async(req, res) =>{
  try {
    if (req.session.isLoggedIn) {
      if (req.body._method === "PATCH") {
        const { username, photo, aboutme, password ,repassword } = req.body;

        // Fetch the user information from the database
        const userId = req.session.userId;
        const user = await User.findById(userId);

        user.username = username;
        user.aboutme = aboutme;
        user.password = password;
        user.photo = photo;

        await user.save();

        // Redirect back to the profile page
        res.redirect("/profile");
      }else {
        res.status(400).json({ error: "Invalid request method." });
      }
    } else {
      // Redirect to the login page if not logged in
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while updating the profile." });
  }
});

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



//UNTESTED


app.post("/api/comment", async(req, res) =>{
  try {
    if (req.session.isLoggedIn) {
        const userId = req.session.userId;
        const user = await User.findById(userId);
        const { content, parentPostId, parentCommentId } = req.body;

        //To Add: get  the parent post and parent comment
          // Create a new comment object
        const newComment = new Comment({
          userID: user._id,
          content,
          parentPost: parentPostId, // Add the parent post if available
          parentComment: parentCommentId, // Add the parent comment if available
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
    res.status(500).json({ error: "An error occurred." });
  }
})