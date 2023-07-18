//To DO
//Overall: HTML encoding by EJS ( special symbols are shown as `&lt;` and so on)
//        input sanitization and general checking
//remove a lot of the isLoggedIn checks -> /post/:title  /profile/:username  
//sort by date and by 'most popular'
//add landing pages for errors

//SEMI-Done
//patch profile -> need to fix profile pic, also displaying of posts in /profile (breaks when >1 post)
//reacting -> check if works for comments. works everywhere else.
//post, patch, delete comment -> comments are stored in the db na, to fix reacting

//DONE FOR SURE
// login, signup, logout -> to add: hashing password (optional, code is there but doesnt fully work for logging in and editing password)
//post post
//patch, delete post -> maybe paganda patching, like takign the inputs (currently uses alerts)
//search 

require('dotenv').config();
const link = process.env.DB_URL;
const authRoutes = require('./sessions/router');
const { isLoggedInMiddleware } = require('./lib/middleware');
const { userIDMiddleware } = require('./lib/middleware');
const { hashPassword } = require('./lib/hashing');
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
// app.use(hashPassword);


app.get("/index", async (req, res) => {
  try {
    if (req.session?.isLoggedIn) {
      console.log(req.sessionID);
      console.log(req.session.isLoggedIn);
      const userId = req.session.userId;
      console.log(userId);
      const posts = await Post.find({ isDeleted: false }).limit(0);

      // Get the number of positive and negative votes for each post
      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        const userReaction = await React.findOne({
          userID: userId,
          parentPostID: post._id,
          isVoted: true,
        });
        post.userReaction = userReaction ? userReaction.voteValue : 0;

        const positiveCount = await React.countDocuments({ parentPostID: post._id, voteValue: 1 });
        const negativeCount = await React.countDocuments({ parentPostID: post._id, voteValue: -1 });
        const ratingCount = positiveCount - negativeCount;
        post.rating = ratingCount;
      }

      res.render("index", { posts});
    } else {
      console.log("Currently not logged in, showing a limited number of posts!")
      const limit = 20; // Change the limit value as needed
      const posts = await Post.find({ isDeleted: false }).limit(limit);
      
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
        // Use the comparePassword method to check if the provided password matches the hashed password in the database
        // const isPasswordMatch = await user.comparePassword(password);

        // if (!isPasswordMatch) {
        //   return res.status(400).json({ error: "Invalid username or password." });
        // }
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
      console.log("viewing profile of: ", userId, " with username: ", user.username);
      //console.log(posts !== null);
      
      console.log(posts);
      if(posts.length === 0){
        user.posts = user.posts;
      }
      else{
        user.posts = posts;
      }
      
      console.log(userId);
      console.log(user);
      let IsCurrUserTheProfileOwner = true;
      // Render the profile page with the user's information
      res.render("profile", { user, IsCurrUserTheProfileOwner});
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
    //if (req.session.isLoggedIn) {
      //logged in user info
      //const userLoggedIn = User.findById(req.session.userId);

      //profile of :username
      const { username } = req.params;
      let user = await User.findOne({ username });
      let userId = user._id;
      //console.log(req.session.userId.toString(), " ", userId.toString())

      let IsCurrUserTheProfileOwner = false;
      if(req.session.userId != null && req.session.userId.toString() === userId.toString()){
        IsCurrUserTheProfileOwner = true;
        res.redirect("/profile");
      }

      
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
      res.render("profile", { user, IsCurrUserTheProfileOwner });
    // } else {
    //   // Redirect to the login page if not logged in
    //   res.redirect("/login");
    // }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching user information." });
  }
});

app.patch("/api/user/:username", async (req, res) => {
  try {
    if (req.session.isLoggedIn) {
      const userID = req.session.userId;
      const username = req.params.username;
      const newUsername = req.body.username;
      const newPassword = req.body.password;
      const updateData = req.body;
      if (newPassword !== "" && req.body.password === req.body.repassword) {
        newPassword = newPassword.toString();
        // If the new password is provided, hash and update the password field
        //const hashedPassword = await hashPassword(newPassword);
        updateData.password = newPassword;
      }else{
        delete updateData.password;
      }
      console.log(username);
      // Assuming you want to find the user by the username
      //const user = await User.findById(userId);
      //update the user fields
      // Object.keys(updateData).forEach((key) => {
      //   user[key] = updateData[key];
      // });
      // await user.save();

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

// //display posts
// app.get("/post/:title", async (req, res) => {
//   try {
//     if (req.session.isLoggedIn) {
//       const title = req.params.title;
//       //currently logged in user
//       const userId = req.session.userId;
//       const user = await User.findById(userId);
//       // Retrieve the post from the database based on the title
//       const post = await Post.findOne({ title });

//       if (!post) {
//         return res.status(404).json({ error: "Post not found." });
//       }

//       // Fetch all top-level comments for the post
//       const topLevelComments = await Comment.find({ parentPostID: post._id, parentCommentID: null })
//         .populate("userID") // Populate the user details for each comment
//         .exec();

//       // A recursive function to fetch comments of comments and so on
//       async function fetchChildComments(comment) {
//         const childComments = await Comment.find({ parentCommentID: comment._id })
//           .populate("userID")
//           .exec();

//         if (childComments.length === 0) {
//           return [];
//         }

//         const recursiveChildComments = await Promise.all(
//           childComments.map(async (childComment) => {
//             childComment.childComments = await fetchChildComments(childComment);
//             return childComment;
//           })
//         );

//         return recursiveChildComments;
//       }

//       // Fetch comments recursively for each top-level comment
//       const comments = await Promise.all(
//         topLevelComments.map(async (comment) => {
//           comment.childComments = await fetchChildComments(comment);
//           return comment;
//         })
//       );

//       // Author of the post
//       const author = await User.findOne({ username: post.author });
//       const postID = post._id;
//       const positiveCount = await React.countDocuments({ parentPostID: post._id, voteValue: 1 });
//       const negativeCount = await React.countDocuments({ parentPostID: post._id, voteValue: -1 });
//       const ratingCount = positiveCount - negativeCount;
//       post.rating = ratingCount;
//       const isCurrUserTheAuthor = author.username === user.username;

//       console.log("num of top level comments: ", topLevelComments.length);
//       console.log("this post's id: ", post._id);
//       console.log("this post's id: ", postID);

//       console.log(comments);

//       //if user has already reacted or not
//       const react = await React.findOne({ userID: user._id, parentPostID: post._id });
//       const reactValue = react ? react.voteValue : 0;
//       console.log("react object: ", react)
//       console.log("react value: ", reactValue)

//       res.render("post", { postID, user, post, author, isCurrUserTheAuthor, comments, reactValue });
//     } else {
//       // Redirect to the login page if not logged in
//       res.redirect("/login");
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "An error occurred while retrieving the post." });
//   }
// });

app.get("/post/:title", async (req, res) => {
  try {
    if (req.session.isLoggedIn) {
      // Retrieve the post from the database based on the title
      const title = req.params.title;
      const post = await Post.findOne({ title });
      //currently logged in user
      const userId = req.session.userId;
      const user = await User.findById(userId);

      if (!post) {
        return res.status(404).json({ error: "Post not found." });
      }

      // Fetch all top-level comments for the post
      const topLevelComments = await Comment.find({ parentPostID: post._id, parentCommentID: null })
        .populate("userID") // Populate the user details for each comment
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
            return childComment;
          })
        );

        return recursiveChildComments;
      }

      // Fetch comments recursively for each top-level comment
      const comments = await Promise.all(
        topLevelComments.map(async (comment) => {
          comment.childComments = await fetchChildComments(comment);
          return comment;
        })
      );

      // Author of the post
      const author = await User.findOne({ username: post.author });
      const postID = post._id;
      const positiveCount = await React.countDocuments({ parentPostID: post._id, voteValue: 1 });
      const negativeCount = await React.countDocuments({ parentPostID: post._id, voteValue: -1 });
      const ratingCount = positiveCount - negativeCount;
      post.rating = ratingCount;
      const isCurrUserTheAuthor = author.username === user.username;

      console.log("num of top level comments: ", topLevelComments.length);
      console.log("this post's id: ", post._id);
      console.log("this post's id: ", postID);

      console.log(comments);

      //if user has already reacted or not
      const react = await React.findOne({ userID: user._id, parentPostID: post._id });
      const reactValue = react ? react.voteValue : 0;
      console.log("react object: ", react)
      console.log("react value: ", reactValue)

      res.render("post", { postID, user, post, author, isCurrUserTheAuthor, comments, reactValue });
    } else {

      const title = req.params.title;
      const post = await Post.findOne({ title });

      if (!post) {
        return res.status(404).json({ error: "Post not found." });
      }

      // Fetch all top-level comments for the post
      const topLevelComments = await Comment.find({ parentPostID: post._id, parentCommentID: null })
        .populate("userID") // Populate the user details for each comment
        .exec();

      // A recursive function to fetch comments of comments and so on
      async function fetchChildComments(comment) {
        console.log("poster name: ", comment.userID.username)
        const childComments = await Comment.find({ parentCommentID: comment._id })
          .populate("userID")
          .exec();
        
        if (childComments.length === 0) {
          return [];
        }

        const recursiveChildComments = await Promise.all(
          childComments.map(async (childComment) => {
            childComment.childComments = await fetchChildComments(childComment);
            return childComment;
          })
        );

        return recursiveChildComments;
      }

      // Fetch comments recursively for each top-level comment
      const comments = await Promise.all(
        topLevelComments.map(async (comment) => {
          comment.childComments = await fetchChildComments(comment);
          return comment;
        })
      );
        
      // Author of the post
      const postID = post._id;
      const positiveCount = await React.countDocuments({ parentPostID: post._id, voteValue: 1 });
      const negativeCount = await React.countDocuments({ parentPostID: post._id, voteValue: -1 });
      const ratingCount = positiveCount - negativeCount;
      post.rating = ratingCount;
      const isCurrUserTheAuthor = false;
     
      //console.log(comments);

      //if user has already reacted or not (not, since di naka log in)
      const reactValue = 0;
      let  user = User.schema;
      user.username = 'visitor';
      const author = await User.findOne({ username: post.author });
      res.render("post", { postID, user, post, author, isCurrUserTheAuthor, comments, reactValue });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while retrieving the post." });
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
      post.title = req.body.title;
    }

    if (req.body.content) {
      post.content = req.body.content;
    }

    // Check if the 'isDeleted' field exists in the request body
    // If it does, update the 'isDeleted' field in the post
    if (req.body.isDeleted !== undefined) {
      post.isDeleted = req.body.isDeleted;
    }

    post.editDate = Date.now();

    // Save the updated post in the database
    await post.save();

    res.json({ message: "Post updated successfully", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

//post new comment
app.post("/api/comment", async (req, res) => {
  try {
    if (req.session.isLoggedIn) {
      const userId = req.session.userId;
      const user = await User.findById(userId);
      const { content, parentPostID, parentCommentID } = req.body;
      console.log("parent post id as string:", parentPostID);
      let parentPostIdObject = new mongoose.Types.ObjectId(parentPostID); //converts the string representation parentPostID to mongoose id
      let parentCommentIdObject = null;
      if(parentCommentID){
        parentCommentIdObject = new mongoose.Types.ObjectId(parentCommentID);
      }
      console.log("parent post id as object: ", parentPostIdObject)
      const masterPost = await Post.findById(parentPostIdObject); //gets master post of the comment, no matter the depth
      console.log("Master post object: ", masterPost);
      // Create a new comment object
      const newComment = new Comment({
        userID: user._id,
        author: user.username,
        content,
        parentPostID: parentPostIdObject, // Add the parent post if available
        parentCommentID: parentCommentIdObject, // Add the parent comment if available
      });

      // Save the new comment object to the database
      await newComment.save();
      res.redirect(`/post/${encodeURIComponent(masterPost.title)}`);
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
      comment.content = req.body.content;
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
    res.status(500).json({ error: "Server error" });
  }
});


//server side for handling reactions
app.post('/api/react', async (req, res) => {
  try {
    if (req.session.isLoggedIn) {
      const userId = req.session.userId;
      const user = await User.findById(userId);
      const postId = req.body.postID;
      const reactionValue = req.body.reactionValue;
      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      const existingReact = await React.findOne({ userID: userId, parentPostID: postId });
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
        const newReact = new React({
          userID: userId,
          parentPostID: postId,
          isVoted: true,
          voteValue: reactionValue
        });
        await newReact.save();
      }

      res.json({ message: 'Reaction updated successfully' });
    } else{
      res.redirect("/login");
    }
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
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
    
    const commentData = await Comment.find({
      $and: [
        { content: { $regex: regex } },
        { isDeleted: false }
      ]
    });

    const combinedData = [...postData, ...commentData];
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
      res.json({ postTitle });
    } else {
      res.status(404).json({ error: 'Post not found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while searching for the post.' });
  }
});


