// # Appdev Todo [Updated 11:30PM July 19)
//    - input sanitization (sorta done?) and anti cross-site scripting (anti-hack stuff)
//    - fix search
  
//   ## Functionalities DONE FOR SURE
//    - User: login, signup, logout, profile (updating, showing of posts)  
//          - added password hashing
//    - Posts: new post, patch post, delete post -> maybe paganda patching, make it more obvious that fields are editable
//    - Comment: new comment, patch comment, delete comment -> maybe paganda patching, make it more obvious that fields are editable
//    - Reacting: new reacts, editing reacts, removing reacts
//    - Search
//    - Sort by date and by 'most popular' -> a bit faster, also added caching
//    - fixed html encoing for special characters (only in posts/comments; usernames are req'd to only be alpha-numeric)
//    - double check session/cookie lifespan (just setting it to 2 days if u dont click the remember me.)

require('dotenv').config();
const link = process.env.DB_URL;
const authRoutes = require('./sessions/router');
const { isLoggedInMiddleware } = require('./lib/middleware');
const { userIDMiddleware } = require('./lib/middleware');
const { hashPassword } = require('./lib/hashing');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser')
const ejs = require('ejs-async');
const cors = require('cors');
const he = require("he");
const MongoStore = require('connect-mongodb-session')(session);

const app = express();

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const store = new MongoStore({
  uri: link,
  collection: 'sessions',
});

//Set the TTL index on the sessions collection
// store.on('connected', () => {
//   store.client
//     .db()
//     .collection('sessions')
//     .createIndex({ expires: 1000 }, { expireAfterSeconds: 0 });
// });
app.use(cors());
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
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 * 2, //2 days 
    httpOnly: true,
    secure: false, 
    // set to true in production if using HTTPS
  },
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
    const TWO_DAYS_IN_MS = 2 * 24 * 60 * 60 * 1000;
    const currentDate = new Date();
    let sortBy = req.query.sortBy || "createDate"; 
    let sortOrder = req.query.sortOrder || "desc"; 
    const postsPerPage = 15;

    // Validate the sorting criteria to avoid potential security issues
    const allowedSortFields = ["createDate", "rating", "hotness"];
    const allowedSortOrders = ["asc", "desc"];
    if (!allowedSortFields.includes(sortBy)) {
      sortBy = "createDate";
    }
    if (!allowedSortOrders.includes(sortOrder)) {
      sortOrder = "desc";
    }
    
    const page = parseInt(req.query.page) || 1; 
    const skipPosts = (page - 1) * postsPerPage; 

    let posts = [];
    const isUserLoggedIn = req.session?.isLoggedIn;

    let cachedPosts = req.session.cachedPosts;
    let noUpdate = req.session.cachedNoUpdate;
    const cacheExpirationTime = 2;
    //noUpdate = false;
    //let temp = await Post.find({isDeleted: false});
    const cacheTimestamp = req.session.cacheTimestamp;
    const currentTime = new Date().getTime();
    const cacheAgeInMinutes = (currentTime - cacheTimestamp) / (1000 * 60);
    //console.log(cachedPosts)
    console.log(noUpdate && (cacheAgeInMinutes <= cacheExpirationTime));

    if(noUpdate && (cacheAgeInMinutes <= cacheExpirationTime)){
      posts = cachedPosts;
    } else {
      req.session.cacheTimestamp = new Date().getTime();
      req.session.cachedNoUpdate = true;
      const queryConditions = isUserLoggedIn ? { isDeleted: false } : { isDeleted: false, /* Add any other conditions if needed for non-logged-in users */ };


      posts = await Post.find(queryConditions);

      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        const userReaction = await React.findOne({
          userID: req.session.userId,
          parentPostID: post._id,
          isVoted: true,
        });
        post.userReaction = userReaction ? userReaction.voteValue : 0;

        // const positiveCount = await React.countDocuments({ parentPostID: post._id, voteValue: 1 });
        // const negativeCount = await React.countDocuments({ parentPostID: post._id, voteValue: -1 });
        // const ratingCount = positiveCount - negativeCount;
        // await Post.findByIdAndUpdate(post._id, { rating: ratingCount    })
        
        // post.rating = ratingCount;

        const timeDifferenceInMs = currentDate - post.createDate;
        const decayFactor = Math.exp(-timeDifferenceInMs / TWO_DAYS_IN_MS);
        const ratingWithDecay = post.rating * decayFactor;
        post.hotnessScore = ratingWithDecay;

        const decodedTitle = he.decode(post.title);
        const decodedContent = he.decode(post.content);
        post.title = decodedTitle;
        post.content = decodedContent;
        
      }
      req.session.cachedPosts = posts;
    }

    if (sortBy === "rating") {
      posts.sort((a, b) => (sortOrder === "desc" ? b.rating - a.rating : a.rating - b.rating));
    } else if (sortBy === "hotness") {
      posts.sort((postA, postB) => postB.hotnessScore - postA.hotnessScore);
    } else {
      posts.sort((a, b) => (sortOrder === "desc" ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy]));
    }

    const paginatedPosts = posts.slice(skipPosts, skipPosts + postsPerPage);
    let totalPosts = posts.length;
    let totalPages = Math.ceil(posts.length/postsPerPage);

    res.render("index", { page, he, paginatedPosts, totalPosts, totalPages, sortBy, sortOrder });
  } catch (error) {
    console.error(error);
    //res.status(500).json({ error: "An error occurred while fetching posts." });
    res.status(500).render("fail", { error: "An error occurred while fetching posts." });
  }
});

app.get("/", (req, res)=>{
  res.redirect("/index")
})

app.get("/index", (req, res)=>{
    res.render("index")
})

app.get("/register", (req, res)=>{
  if(req.session.isLoggedIn){
    req.session.cachedNoUpdate = false;
    res.redirect("/profile");
  }else{
  return res.render("register", {error: null})
  }
  res.render("register", {error: null})
})
app.get("/success", (req, res)=>{
  res.render("success")
})
app.get("/login", (req, res)=>{
  if(req.session.isLoggedIn){
    req.session.cachedNoUpdate = false;
    res.redirect("/profile");
  }else{
  return res.render("login", {error: null})
  }
})

app.get("/logout", async(req, res)=>{
  await req.session.destroy();
  console.log("not logged in");
  res.render("logout")
})

app.get("/profile/edit/", async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);
    res.render("profile-edit", { user, error: null });
  } catch (error) {
    console.error(error);
    res.status(500).render("fail", { error: "An error ocurred while fetching user information." });
    //res.status(500).json({ error: "An error occurred while fetching user information." });
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
app.get("/fail", (req, res) =>{
  res.render("fail", {error: null})
})


//logging in
app.post("/login", async (req, res) => {
  try {
    console.log("does req.session not exist?", !req.session.isLoggedIn);
    if(!req.session.isLoggedIn){
      const { username, password, remember } = req.body;
      const user = await User.findOne({ username });
          const isPasswordMatch = await user.comparePassword(password);

          if (!isPasswordMatch ) {
            return res.status(400).render("login", { error: "Wrong Password." });
          }

      if (!user._id) {
        
        return res.status(500).render("login", { error: "An error occurred while retrieving user ID." });
      }
      req.session.isLoggedIn = true;

      req.session.userId = user._id;
      console.log("user id of session: ", req.session.userId)
      if(remember) {
        console.log(remember);
        req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 21; // 21 days
      }else{
        console.log(remember);
        req.session.cookie.maxAge = 24 * 60 * 60 * 1000 * 2;  //2 days

      }
      res.redirect("/profile");
    }
    else{
      res.redirect("/profile");
    }
  } catch (error) {
    console.error(error);
    
    return res.status(500).render("login", { error: "That user does not exist." });
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

const flash = require("connect-flash");

// Assuming you have set up the flash middleware
app.use(flash());

// Custom middleware to expose flash messages to views
app.use((req, res, next) => {
  res.locals.successFlash = req.flash("success");
  res.locals.errorFlash = req.flash("error");
  next();
});
// app.get("/register", (req, res) => {
//   const isLoggedIn = req.session.isLoggedIn || false;
//   res.render("register", { isLoggedIn, successFlash: req.flash("success"), errorFlash: req.flash("error") });

// });

app.post("/api/user", async (req, res) => {
  try {
    //ifLoggedIn = false;
    //console.log(isLoggedIn, successFlash, errorFlash );
    const { username, password, repassword } = req.body;

    if (password !== repassword) {
      //req.flash("error", "Passwords do not match.");
      return res.status(400).render("register", { error: "Passwords do not match." });
      //return res.redirect("/register"); 
    }

    //checking inputs for other stuff
    const MIN_PASSWORD_LENGTH = 6; 
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/; 
    if (password.length < MIN_PASSWORD_LENGTH || !passwordRegex.test(password)) {
      //req.flash("error", "Password must be at least 6 characters long and must contain upper and lowercase lettes, and numbers.");
      return res.status(400).render("register", { error: "Password must be at least 6 characters long and must contain upper and lowercase lettes, and numbers." });
      //return res.redirect("/register"); 
    }

    let usernameRegex = /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9_-]*$/;
    if (!usernameRegex.test(username) || username.toLowerCase() === "visitor") {
      //req.flash("error", "Username must contain at least one letter or number and cannot be 'visitor'!");
      return res.status(400).render("register", { error: "Username must contain at least one letter or number and cannot be 'visitor'!" });
      //return res.redirect("/profile-edit"); 
    }
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      //req.flash("error", "Username already exists.");
      //return res.redirect("/register"); 
      return res.status(400).render("register", { error:"Username already exists"});
    }

    const user = new User({ username, password });
    const savedUser = await user.save();

    savedUser.userId = savedUser._id;
    await savedUser.save();

    //req.flash("success", "Registration successful!"); // Flash success message
    res.redirect("/success"); // Redirect to the login page with the success message
  } catch (error) {
    console.error(error);
    //req.flash("error", "An error occurred while saving the user.");
    //res.redirect("/register"); // Redirect to the registration page with the flash message
    return res.status(505).render("register", { error: "An error occured, please try again" });
  }
});


app.get("/success", (req, res) => {
  res.render("success");
});



app.get("/profile", async (req, res) => {
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

app.get("/profile/:username", async (req, res) => {
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

app.patch("/api/user/:username", async (req, res) => {
  try {
    if (req.session.isLoggedIn) {
      const userID = req.session.userId;
      const username = req.params.username;
      const newUsername = req.body.username;
      let newPassword = req.body.password;
      const updateData = req.body;
      newPassword = newPassword.toString();
      //const MIN_PASSWORD_LENGTH = 6; 
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{6,}$/; 

      //console.log(newPassword.length >= MIN_PASSWORD_LENGTH)
      console.log(passwordRegex.test(newPassword))
      if (newPassword !== "" && req.body.password === req.body.repassword && passwordRegex.test(newPassword)) {
        console.log("hi")
        updateData.password = newPassword;
      }else{
        delete updateData.password;
        req.session.expires = null;
      }
      // let usernameCheck = User.findOne({username: newUsername});
      // if(usernameCheck){
      //   req.flash("error", "Username already taken!")
      //   return res.redirect("/profile-edit");
      // }

      let usernameRegex = /^(?=.*[a-zA-Z0-9])[a-zA-Z0-9_-]*$/;
      if (!usernameRegex.test(newUsername)) {
        //req.flash("error", "Username must contain at least one letter or number!");
        //return res.redirect("/profile-edit"); 
        return res.status(400).render("profile-edit", { error: "Username must contain at least one letter or number!"});
      }

      let aboutmeRegex = /^[a-zA-Z0-9\t\n\r\s]*(?![\x22\x27])/;
      if (!aboutmeRegex.test(req.body.aboutme)) {
        // req.flash("error", "About me cannot contain quotation marks");
        // return res.redirect("/profile-edit"); 
        return res.status(400).render("profile-edit", { error: "About me cannot contain quotation marks!"});
      }

      const user = await User.findOneAndUpdate({ username }, updateData, { new: true });
      await Post.updateMany({ author: username }, { author: newUsername });
      await Comment.updateMany({ author: username }, { author: newUsername });

      if (user) {
        // User found and updated successfully
        return res.json(user);
        //return res.redirect("/profile");
      } else {
        // User not found, return appropriate response
        //return res.status(404).json({ error: 'User not found' });
        return res.status(404).render("profile-edit", { error: "User not found"});
      }
    }else{
      res.redirect("/login");
    }
  } catch (error) {
    console.error(error);
    //return res.status(500).json({ error: 'An error occurred while updating the profile' });
    return res.status(500).render("profile-edit", { error: "An error occurred while updating the profile"});
  }
});


//new post (save to db)
app.post("/api/post", async (req, res) => {
  try {
    if (req.session.isLoggedIn) {
      const userId = req.session.userId;
      const user = await User.findById(userId);
      let { title, content } = req.body;
      title = title.replace(/'/g, "\\'").replace(/"/g, '\\"');
      content = content.replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n(?=.)/g, "<br>");

      // Create a new post object
      const newPost = new Post({
        userID: user._id,
        title,
        content,
        author: user.username,
        createDate: new Date(), // Set createDate to the current date
      });

      // Save the new post object to the database
      req.session.cachedNoUpdate = false;
      await newPost.save();
      res.redirect("/index");
    } else {
      // Redirect to the login page if not logged in
      // Also, display a message "you need to login first!"
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


app.get("/post/:id", async (req, res) => {
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
app.patch("/api/post/:id", async (req, res) => {
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

//post new comment
app.post("/api/comment", async (req, res) => {
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
      res.redirect(`/post/${encodeURIComponent(masterPost._id)}`);
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
app.patch("/api/comment/:id", async (req, res) => {
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


//server side for handling reactions
app.post('/api/react', async (req, res) => {
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
      if (existingReact) {
        // User has already reacted, update the voteValue
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

      if(reactParentType == 'post'){
        // const positiveCount = await React.countDocuments({ parentPostID: parentId, voteValue: 1 });
        // const negativeCount = await React.countDocuments({ parentPostID: parentId, voteValue: -1 });
        // const ratingCount = positiveCount - negativeCount;
        const post = await Post.findById(parentId);
        let ratingCount = post.ratingCount || 0;
        ratingCount = ratingCount + parseInt(reactionValue);
        await Post.findByIdAndUpdate(parentId, {
          rating: ratingCount,
          //hotnessScore: calculateHotnessScore(ratingCount, post.createDate),
        });
        }
      else{
        // const positiveCount = await React.countDocuments({ parentCommentID: parentId, voteValue: 1 });
        // const negativeCount = await React.countDocuments({ parentCommentID: parentId, voteValue: -1 });
        // const ratingCount = positiveCount - negativeCount;
        const comment = await Comment.findById(parentId);
        ratingCount = comment.ratingCount  || 0;
        ratingCount = ratingCount + reactionValue;
        await Comment.findByIdAndUpdate(parentId, {
         rating: ratingCount,
        });
      }
      //await newReact.save();
      req.session.cachedPosts = []; 
      req.session.cachedNoUpdate = false;
      res.json({ message: 'Reaction updated successfully' });
    } else{
      res.redirect("/login");
    }
  }catch (error) {
    console.error(error);
    //res.status(500).json({ error: 'Server error' });
    res.status(500).render("fail", { error: "Server error." });
  }
});

app.get("/searchuser/:key", async (req, res) => {
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

app.get("/searchpost/:key", async (req, res) => {
  try {
    const regex = new RegExp(req.params.key, 'i'); // 'i' flag for case-insensitive search

    const postData = await Post.find({
      $and: [
        { $or: [
          { title: { $regex: regex } },
          { content: { $regex: regex } }
        ] },
        { isDeleted: false }
      ]
    });
    

    const combinedData = [...postData];
    res.json(combinedData); // Sending the retrieved data as JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during the search." });
  }
});

app.get('/searchcomment/:key', async (req, res) => {
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




app.get("/comment/:id", async (req, res) => {
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