import User from "../models/userModel.js";
import _ from "lodash";
import Joi from "joi";
import bcrypt from "bcryptjs";
import genTokenAndSetToken from "../utils/generateTokenandSetToken.js";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import Post from "../models/postModel.js";


export const getuserProfile = async (req, res) => {
  const { query } = req.params
  try {
    let user;
    if(mongoose.Types.ObjectId.isValid(query)){
      user = await User.findOne({ _id: query }).select("-password").select("-createdAt");
    }else {
      user = await User.findOne({ username: query }).select("-password").select("-createdAt");
    }

    if(!user)
      return res.status(400).json({error:"User not found"});
    
    return res.status(200).json(user);
  } catch (error) {
    console.log("Error in getuserProfile, userController", Error);
    return res.status(500).json({ error: Error.message });
  } 
}

export const signupUser = async (req, res) => {
  const signupValidation = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().required(), 
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  })

  try {
    const { error } = signupValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, username, email, password } = _.pick(req.body, ['name', 'username', 'email', 'password']);

    const userExists = await User.exists({ $or: [{ username: username }, { email: email }] });
    if(userExists) return res.status(400).json({ error: "User already exists" });

    const saltnumber = 10;
    const hashedPassword = await bcrypt.hash(password, saltnumber);

    const newUser = new User({ name, username, email, password: hashedPassword });
    await newUser.save();

    if(newUser) {
      genTokenAndSetToken(newUser._id, res);
      return res.status(200).json({ newUser: {
        _id: newUser._id, 
        name: newUser.name,
        username: newUser.username, 
        email: newUser.email,
        password: newUser.password,
        bio: newUser.bio,
        profilePic: newUser.profilePic,
      }, message: "Signedup successfully"
    });
    }

    return res.status(201).json({ message: "Invalid User data" });
  } catch (error) {
    console.log("Error in signupUser, userController: ", error);
    return res.status(500).json({ error: error.message });
  }
}

export const loginUser = async (req, res) => {
  const loginValidation = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
  });

  try {
    const { error } = loginValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    
    const { username, password } = _.pick(req.body, ['username', 'password']);
    const loginUser = await User.findOne({ username });

    if (!loginUser) return res.status(400).json({ error: "Invalid username or password" });

    const isPassWordCorrect = await bcrypt.compare(password, loginUser.password);
    if (!isPassWordCorrect) return res.status(400).json({ error: "Invalid username or password" });

    if(loginUser.isFrozen){
      loginUser.isFrozen = false;
      await loginUser.save();
    }

    genTokenAndSetToken(loginUser._id, res);

    res.status(200).json({
      user: {
        _id: loginUser._id,
        name: loginUser.name,
        username: loginUser.username,
        email: loginUser.email,
        bio: loginUser.bio,
        password: loginUser.password,
        profilePic: loginUser.profilePic,
      }, message: "logged in successfully"
    });
  } catch (error) {
    console.log("Error in loginUser, userController: ", error);
    return res.status(500).json({ error: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", {maxAge: 1});
    return res.status(200).json({ message : "User logout successfully" });
  } catch (error) {
    console.log("Error in logoutUser, userController: ", error);
    return res.status(500).json({ error: error.message });
  }
}

export const followUnfollowUser = async (req, res) => {
  try {
    const { id } = _.pick(req.params, ['id']);

    if(!id || !mongoose.isValidObjectId(id)) return res.status(400).json({ error: "Id is invalid, doesn't exists or is not given" });

    const userToModify = await User.findById(id);
    const userCurrent = await User.findById(req.user._id);

    if(id == req.user._id.toString()) return res.status(400).json({ error: "You can't follow or unfollow your self" });
    if(!userToModify || !userCurrent) return res.status(400).json({ error: "User not found" });

    const isFollowing = userCurrent.following.includes(id);
    if(isFollowing){
      await User.findByIdAndUpdate(req.user._id, {$pull: {following: id}});
      await User.findByIdAndUpdate(id, {$pull: {followers: req.user._id}});
      return res.status(201).json({message: "User unfollowed successfully"});
    }else{
      await User.findByIdAndUpdate(req.user._id, {$push: {following: id}});
      await User.findByIdAndUpdate(id, {$push: {followers: req.user._id}});
      return res.status(201).json({message: "User followed successfully"});
    }

  } catch (error) {
    console.log("Error in follow_user, userController: ", error);
    return res.status(500).json({ error: error.message });
  }
}

export const updateUser = async (req, res) => {
  const { name, email, username, password, bio } = req.body;
  let { profilePic } = req.body;

  const userId = req.user._id;
  try {
    let user = await User.findById(userId);
    if(!user) return res.status(400).json({ error: "User not found" });

    if(req.params.uid !== userId.toString()) 
      return res.status(400).json({error:"You can't modify others profile"});

    if(password){
      if(!(password.length >= 6)) return res.status(400).json({error:"password must be at least 6 characters"});

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }

    if (profilePic) {
      if (user.profilePic) {
        const publicId = user.profilePic.split("/").pop().split("?")[0].split(".")[0];
        await cloudinary.uploader.destroy(publicId);
      }
      

			const uploadingResponse = await cloudinary.uploader.upload(profilePic);
      profilePic = cloudinary.url(uploadingResponse.public_id, {
        transformation: [
          {
            quality: 'auto',
            fetch_format: 'auto'
          },
          {
            width: 1200,
            height: 1200,
            crop: 'fill',
            gravity: 'auto'
          }
        ]
      })
		}
    
    user.bio = bio || user.bio;
    user.name = name || user.name;
    user.email = email || user.email;
    user.username = username || user.username;
    user.profilePic = profilePic || user.profilePic;

    user = await user.save();

    await Post.updateMany(
      {"replies.userId": userId},
      {
        $set:{
          "replies.$[reply].username" :user.username,
          "replies.$[reply].userProfilePic" :user.profilePic
        }
      },
      {arrayFilters:[{"reply.userId":userId}]}
    )

    user.password = null;
    return res.status(200).json({message: "Profile updated successfully", user});

  } catch (error) {
    console.log("Error in updateUser, userController: ", error);
    return res.status(500).json({ error: error.message });
  }
}

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = _.get(req.user, "_id");
    const usersFollowedByYou = await User.findById(userId).select("following");

    const users = await User.aggregate([
      {
        $match: {
          _id: {$ne: userId}
        }
      },
      {
        $sample: {size: 10}
      }
    ])

    const filteredUsers = users.filter(user => !usersFollowedByYou.following.includes(user._id));
    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach(user => user.password = null);

    res.status(200).json(suggestedUsers);

  } catch (error) {
    console.log("Error in getSuggestedUser , userController: ", error);
    return res.status(500).json({ error: error.message });
  }
}

export const freezeAccount = async (req, res) => {
  const userId = _.get(req.user, "_id");
  try {
    const user = await User.findById(userId);
    if(!user)
      return res.status(400).json({error: "user not found"});

    user.isFrozen = true;
    await user.save();

    return res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error in freezeAccount, userController: ", error);
    return res.status(500).json({ error: error.message });
  }
}