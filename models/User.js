const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    // userId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     unique: true,
    //   },
    username: String,
    photo: {type: String, default: 'link-to-noimage.png'}, //url to the pic or smth like that
    password: String,
    aboutme: {type: String, default: 'No information provided'},
    remembered: {type: Boolean, default: false},

    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }]
}, 
    {versionKey: false}
)

const User = mongoose.model('user', UserSchema)
//it will access the all lowercase of whatever's in '' by default
//unless you pass a third parameter (which would be the actual name)


module.exports = User