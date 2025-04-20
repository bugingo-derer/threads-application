import _ from "lodash";
import Post from "../models/postModel.js";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import {v2 as cloudinary} from "cloudinary"
import generateRandomNumber from "../utils/generateRandomNumber.js";


export const getPost = async (req, res) => {
  try {
    const { id } = req.params
    
    if(!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ error: "Invalid id" })
    
    const post = await Post.findById(id);
    
    if(!post)
      return res.status(400).json({ error: "Post not found" });
    
    res.status(200).json(post)
      
  } catch (err) {
    console.log("Error in get posts, post controller: ", err);
    return res.status(500).json({ error: err.message });
  }
} 

export const getRandomPosts = async (req, res) => {
  try {
    const randomNumber = generateRandomNumber(40, 100)
    const randomPosts = await Post.aggregate([
      { $sample: { size: randomNumber } }
    ]).sort({createdAt: -1});
    
    res.status(200).json(randomPosts);
  } catch (error) {
    console.log(error)
    res.status(500).json(error.message);
  }
}
 
export const deletePosts = async (req, res) => {
    try {
        const did = _.pick(req.params, ['id']).id;

        if(!mongoose.isValidObjectId(did))
            return res.status(400).json({ error: "Invalid id" })
        
        const post = await Post.findById(did);
        if(!post)
            return res.status(404).json({ error: "Post not found" });
        
        if(post.postedBy.toString() != req.user._id)
            return res.status(403).json({ error: "Unauthorized to delete others posts ❌" });

        if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

        await Post.findByIdAndDelete(did);

        return res.status(200).json({ message: "Post deleted successfully"})

    } catch (err) {
        console.log("Error in create, post controller: ", err);
        return res.status(500).json({ error: err.message });
    }
}

export const createPost = async (req, res) => {
    try{
        const { postedBy, text } = req.body
        let { img } = req.body;
        
        if(!text)
            return res.status(400).json({ error: "Text are required" })

        if(!postedBy)
            return res.status(400).json({ error: "PostedBy are required" })

        if(!mongoose.isValidObjectId(postedBy))
            return res.status(400).json({ error: "postedBy is in invalid form" })
        
        const user = await User.findById(postedBy)
        if(!user)
            return res.status(400).json({ error: "User not found" })

        if(user._id.toString() != req.user._id.toString())
            return res.status(400).json({ error: "Your can't create post for someone else" });
        
        const maxLength = 500;
        if(text.length > maxLength)
            return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });

		if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}

        const newPost = new Post({ postedBy, text, img });
        await newPost.save()
        
        return res.status(201).json( newPost );
    } catch(err){
        console.log("Error in createPost, post controller: ", err);
        return res.status(500).json({ error: err.message });
    }
}

export const likeUnlikePost = async (req, res) => {
    try {
        const lid = _.pick(req.params, ['lid']).lid;
        
        if (!mongoose.isValidObjectId(lid)) return res.status(400).json({ error: "Invalid id format" });

        const userId = req.user._id;

        const post = await Post.findById(lid);
        if (!post) return res.status(404).json({ error: "Post not found" });

        const userLiked = post.likes.includes(userId);

        if (userLiked) {
          await Post.updateOne({ _id: lid }, { $pull: { likes: userId } });
          return res.status(200).json({ message: "Post unliked successfully" });
        } else {
          await Post.updateOne({ _id: lid }, { $push: { likes: userId } });
          return res.status(200).json({ message: "Post liked successfully" });
        }
    } catch (err) {
        console.log("Error in likeUnlikePost, post controller: ", err);
        return res.status(500).json({ error: err.message });
    }
};

export const getFeedPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if(!user)
            return res.status(400).json({ error: "User not found" });

        const following = user.following;
        // const feedPosts = await Post.find({postedBy:{$in: [...following, userId]}}).sort({createdAt: -1});
        const feedPosts = await Post.find({postedBy:{$in: following}}).sort({createdAt: -1});

        return res.status(200).json(feedPosts);

    } catch (error) {
        console.log("Error in getfeadpost, post controller", error)
        return res.status(500).json({ error: error.message })
    }
}

export const replyToPost = async (req, res) => {
    try {
        const text = req.body.text;
        const pid = req.params.pid;  //pid: post id
        const userId = req.user._id;
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;

        if(!mongoose.isValidObjectId(pid))
            return res.status(400).json({ error: "Invalid id format" })

        if(!text)
            return res.status(400).json({ error: "Text field is required" });
        
        const post = await Post.findById(pid);
        if(!post)
            return res.status(400).json({ error: "Post not found" });
        
        const reply = {userId, text, userProfilePic, username};
        // Post.replies.push(reply);
        post.replies = [...post.replies, reply];
        await post.save();
        
        return res.status(200).json( reply );

    } catch (error) {
        console.log("Error in replyToPost, post controller", error)
        return res.status(500).json({ error: error.message })
    }
}

export const getUserPosts = async (req, res) => {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username })
        if(!user) return res.status(400).json({ error: "User not found" });

        const posts = await Post.find({ postedBy: user._id }).sort({ createdAt: -1 });
        res.status(200).json(posts);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}