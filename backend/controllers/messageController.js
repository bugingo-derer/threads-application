import _ from 'lodash'
import mongoose from 'mongoose';
import Conversation from '../models/conversationModel.js'
import Message from '../models/MessageModel.js';
import Joi from 'joi';
import { getRecipientSocketId, io } from '../sockets/socket.js';
import { v2 as cloudinary } from "cloudinary"


export const getMessages = async (req, res) => {
  try {
    const otherUserId  = _.get(req.params, "otherUserId");
    const userId = _.get(req.user, "_id");
    const conversation = await Conversation.findOne({
      participants: {$all: [userId, otherUserId] }
    })

    if(!conversation){
      return res.status(400).json({error: "conversation not found"})
    }

    const messages = await Message.find({
      conversationId: conversation._id
    }).sort({createdAt: -1})

    res.status(200).json(messages)
  } catch (error) {
    console.log(error)
    res.status(500).json({error: error.message})
  }
}

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId", userId });
    }

    const conversations = await Conversation.find({ participants: userId })
      .populate("participants", "username profilePic")
      .lean(); 

    const sanitizedConversations = conversations.map(convo => ({
      ...convo,
      participants: convo.participants.filter(
        participant => participant._id.toString() !== userId.toString()
      )
    }));

    res.status(200).json(sanitizedConversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { receipientId, message } = _.pick(req.body, ['receipientId', 'message']);
    const senderId = _.get(req.user, "_id", null);
    let img = _.get(req.body, "img", null);

    if (!senderId) return res.status(401).json({ error: "Unauthorized: Sender ID missing" });

    if(!receipientId) return res.status(400).json({ error: "Receiver id is required"})

    if(!mongoose.Types.ObjectId.isValid(receipientId)) return res.status(400).json({ error: "Invalid object Receiver id"})
    
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receipientId] },
    });
    
    if(!conversation){
      conversation = new Conversation({
        participants: [senderId, receipientId],
        lastMessage: {
          text: message,
          sender: senderId
        }
      });
      await conversation.save();
    }

    if (img) {
      const uploaded = await cloudinary.uploader.upload(img, {
        quality: "auto",
        fetch_format: "auto",
        width: 1200,
        height: 1200,
        crop: "fill",
        gravity: "auto"
      });
      img = uploaded.secure_url;
    }
    
    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
      img: img || "",
    });
    
    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: {
          text: message,
          sender: senderId,
        }
      })
    ]); 

    const receipientSocketId = getRecipientSocketId(receipientId);

    if(receipientSocketId) io.to(receipientSocketId).emit("newMessage", newMessage);


    return res.status(201).json(newMessage);

  } catch (error) {
    console.log(error)
    res.status(500).json({error: error.message})
  }
}

