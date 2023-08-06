// # Appdev Todo [Updated 11:30PM July 19)
//    - input sanitization (sorta done?) and anti cross-site scripting (anti-hack stuff)
  
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
const routesUserRegisterAndLogin = require('./routers/routesUserRegisterAndLogin');
const routesUser = require('./routers/routesUser');
const routesPost = require('./routers/routesPost');
const routesComment = require('./routers/routesComment');
const routesReact = require('./routers/routesReact');
const routesSearch = require('./routers/routesSearch');
routesUserRegisterAndLogin

const { isLoggedInMiddleware } = require('./lib/middleware');
const { userIDMiddleware } = require('./lib/middleware');
const { rememberMeMiddleware } = require('./lib/middleware');
const { hashPassword } = require('./lib/hashing');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser')
const ejs = require('ejs-async');
const cors = require('cors');
const he = require("he");
//const MongoStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const MongoStore = require('connect-mongodb-session')(session, mongoose);
//const MongoStore = require('connect-mongo');
//const MongoStore = require('express-mongoose-store')(session, mongoose);
const cheerio = require('cheerio');
const router = express.Router();

const app = express();

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const store = new MongoStore({
  uri: link,
  databaseName: 'SnaccOverflow',
  collection: 'sessions',
  ttl: 21*24*60*60,
  autoRemove: 'native',
});

//Set the TTL index on the sessions collection
// store.on('connected', () => {
//   store.client
//     .db()
//     .collection('sessions')
//     .createIndex({ expires: 1000 }, { expireAfterSeconds: 0 });
// });

app.use(session({
  //name: process.env.SesNAME,
  key: 'user._id',
  secret: process.env.SesSECRET,
  resave: false,
  saveUninitialized: true,
  rolling: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 21,
    //expires: false,
  },
  store: store,
}));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));


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
app.use(rememberMeMiddleware);



app.get("/index", async (req, res) => {
  try {
    const TWO_DAYS_IN_MS = 3 * 24 * 60 * 60 * 1000;
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
    const cacheExpirationTime = 1;
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
    console.log(req.expires);
    res.redirect("/profile");
  }else{
  return res.render("login")
  }
  res.render("login");
})

app.get("/logout", async(req, res)=>{
  await req.session.destroy();
  console.log("not logged in");
  res.render("logout")
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
app.get("/fail", (req, res) =>{
  res.render("fail", {error: null})
})

app.get("/about", (req, res)=>{
  res.render("about")
})


app.use(express.urlencoded({ extended: true }));




app.get("/success", (req, res) => {
  res.render("success");
});

app.use(routesUserRegisterAndLogin);
app.use(routesUser);
app.use(routesPost);
app.use(routesComment);
app.use(routesReact);
app.use(routesSearch);


