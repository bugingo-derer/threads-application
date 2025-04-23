import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from 'crypto'

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  profilePic: {
    type: String,
    default: "",
  },
  followers: {
    type: [String],
    default: [],
  },
  following: {
    type: [String],
    default: [],
  },
  bio: {
    type: String,
    default: "",
  },
  isFrozen: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordTokenExpires: Date,
}, {
  timestamp: true,
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(8).toString('hex');

  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordTokenExpires = Date.now() + (24 * 60 * 60 * 1000);

  return resetToken;
};

userSchema.methods.isPasswordMatch = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;