require('dotenv').config();


var http = require('http');
var fs = require('fs');
http.createServer(function (req, res) {
  fs.readFile('index.html', function(error, data) {
    if (error) {
    res.writeHead (404)
    res.write('Error: File Not Found')
    } else {
    res.write(data)
    }
    res.end()
  })
}).listen(3000)

const express = require('express')
const app = express()
const mongoose = require('mongoose')
//const link = 'mongodb+srv://SOAdmin:Zhr9IM7dRL3khPlb@snaccoverflow.nn8swcb.mongodb.net/SnaccOverflow'
const link = process.env.DB_URL;
mongoose.connect(link)
    .then(()=>console.log('Connected to server!'))
    .catch((error) => console.error('Connection error:', error));
// const port = process.env.PORT || 3000
//     app.listen(port, ()=>{
//         console.log(`Listening to Port ${port}`)
//     })

const User = require('./models/User')
const Comment = require('./models/Comment')
const Post = require('./models/Post')
const React = require('./models/React')




app.use(express.json())
//app.use(express.form())

// app.use(express.urlencoded({extended: true}))
// app.set("view engine", "ejs")

app.get("", (req, res)=>{
    res.render("index.html")
})



app.post("/api/user", async (req, res) => {
  try {
    const { username, password, repassword } = req.body;
    if (password !== repassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    const newUser = new User({ username, password });
    const savedUser = await newUser.save();
    //res.json(savedUser);
    res.redirect("/success");
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

