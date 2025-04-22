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

export const deleteMessage = async (req, res) => {
  const userId = _.get(req.user, "_id");
  const messageId = _.get(req.params, "mid");

  try {
    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: "Message not found" });
    if (message.deleted) return res.status(400).json({ error: "Message already deleted" });
    if (message.sender.toString() !== userId.toString()) return res.status(400).json({ error: "You can't delete someone else's message" });

    const conv = await Conversation.findById(message.conversationId);
    if (!conv) return res.status(404).json({ error: "Conversation not found" });

    message.deleted = true;

    if (conv.lastMessage && conv.lastMessage.text === message.text && conv.lastMessage.sender.toString() === message.sender.toString()) {
      conv.lastMessage = {
        text: "This message is deleted",
        sender: message.sender,
        seen: message.seen,
      };
      await conv.save();
    }
    await message.save();

    const participants = conv.participants.map((participant) => participant.toString());
    participants.forEach((participantId) => {
      const socketId = getRecipientSocketId(participantId);
      if (socketId) {
        io.to(socketId).emit("messageDeleted", {
          messageId: message._id,
          conversationId: message.conversationId,
        });
      }
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};
