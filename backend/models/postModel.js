import mongoose from "mongoose";
import User from "./userModel.js";

const repostSchema = mongoose.Schema({
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  originalPostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  text: {
    type: String,
    maxLength: 500,
  },
  img: {
    type: String,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: User, 
    default: [],
  },
  replies: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
      userProfilePic: {
        type: String,
      },
      username: {
        type: String,
      },
    }
  ]
}, {
  timestamps: true,
});

repostSchema.pre('save', function (next) {
  if (!this.originalPostId) {
    this.originalPostId = this._id;
  }
  next();
});

const Post = mongoose.model('Post', repostSchema);

export default Post;