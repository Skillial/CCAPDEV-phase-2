const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const { hashPassword } = require('../lib/hashing');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, index: { unique: true } },
    photo: {type: String, default: 'https://drive.google.com/uc?id=1R6FSSHlb7L3BO2dzLS_dSfqw_H8D_az7&export=download'}, //url to the pic or smth like that
    password: { type: String, required: true },
    aboutme: {type: String, default: 'No information provided'},
    remembered: {type: Boolean, default: false},

    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'post' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment' }]
}, 
    {versionKey: false}
)

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
  
    try {
      const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
      next();
    } catch (error) {
      return next(error);
    }
  });
  
  UserSchema.pre('findOneAndUpdate', async function (next) {
    if (!this._update.password) return next();
  
    try {
      const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
      const hash = await bcrypt.hash(this._update.password, salt);
      this._update.password = hash;
      next();
    } catch (error) {
      return next(error);
    }
  });
  
  UserSchema.methods.comparePassword = async function (candidatePassword) {
    try {
      return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
      throw error;
    }
  };

const User = mongoose.model('user', UserSchema)
module.exports = User


