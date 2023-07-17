const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const { hashPassword } = require('../lib/hashing');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, index: { unique: true } },
    photo: {type: String, default: './images/dark/file_not_found.png'}, //url to the pic or smth like that
    password: { type: String, required: true },
    aboutme: {type: String, default: 'No information provided'},
    remembered: {type: Boolean, default: false},

    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }]
}, 
    {versionKey: false}
)

// UserSchema.pre('save', function(next) {
//     var user = this;

// // only hash the password if it has been modified (or is new)
// if (!user.isModified('password')) return next();

// // generate a salt
// bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
//     if (err) return next(err);

//     // hash the password using our new salt
//     bcrypt.hash(user.password, salt, function(err, hash) {
//         if (err) return next(err);

//         // override the cleartext password with the hashed one
//         user.password = hash;
//         next();
//     });
// });

// UserSchema.pre("findOneAndUpdate", async function (next) {
//     if (!user.isModified('password')) return next();
//     const update = this.getUpdate() // {password: "..."}
//     if (update.password) {
//       const passwordHash = await bcrypt.hash(update.password, 10);
//       this.setUpdate({ $set: { 
//          password: passwordHash, 
//          confirmpw: undefined 
//         } 
//       });
//     }
//     next()
//   });


// });

// UserSchema.methods.comparePassword = function(candidatePassword, cb) {
//     bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//         if (err) return cb(err);
//         cb(null, isMatch);
//     });
// };


const User = mongoose.model('user', UserSchema)
module.exports = User


