require('dotenv').config();
const link = process.env.DB_URL;

const authRoutes = require('./sessions/router');
const { isLoggedInMiddleware } = require('./lib/middleware');
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const app = express();

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

const store = new MongoStore({
    uri: link,
    collection: 'sessions'
});

app.use(session({
  name: 'example.sid',
  secret: '123455',
  httpOnly: true,
  secure: true,
  maxAge: 1000 * 60 * 60 * 11, //max age in milliseconds, currently set to 1 hr
  resave: false,
  saveUninitialized: true,
  store: store
}));
app.use(isLoggedInMiddleware);



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

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static('public'));


app.get("/index", (req, res) => {
  if (req.session?.isLoggedIn) {
    console.log(req.sessionID);
    console.log("LLLLLL");
    console.log(req.session.isLoggedIn);
    res.render("index");
    //req.session.destroy();
  } else{res.redirect('/login')}
});




app.get("/index", (req, res)=>{
    res.render("index")
})

app.get("/register", (req, res)=>{
  res.render("register")
})
//app.use(authRoutes);
app.get("/login", (req, res)=>{
  res.render("login")
})
app.get("/logout", (req, res)=>{
  req.session.destroy();
  console.log("not logged in");
  res.render("logout")
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
    if (remember) {
      // Set a longer expiration time for the session cookie
      req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 21; // 21 days
    }
    
    res.redirect("/index");
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

    const newUser = new User({ username, password });
    const savedUser = await newUser.save();
    //req.session.isLoggedIn = true;
    res.redirect("/login"); //maybe have a landing page that says "successfully created, you may now log in"
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while saving the user." });
  }
});


app.patch("/api/user/:id", async(req, res)=>{
  const data = await User.findByIdAndUpdate(req.params.id, req.body, {new:true,})
  res.json(data)
})

app.get("/success", (req, res) => {
  // Render the success page
  res.render("success");
});
//To DO
//patch user profile
//post, patch, delete post
//post, patch, delete comment
//add reaction
//patch/remove reaction

//DONE
//login, signup, logout (still need to fix some things)
