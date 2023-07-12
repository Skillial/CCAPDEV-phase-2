const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    username: String,
    photo: {type: String, default: './images/dark/file_not_found.png'}, //url to the pic or smth like that
    password: String,
    aboutme: {type: String, default: 'No information provided'},
    remembered: {type: Boolean, default: false},

    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }]
}, 
    {versionKey: false}
)

const User = mongoose.model('user', UserSchema)
module.exports = User