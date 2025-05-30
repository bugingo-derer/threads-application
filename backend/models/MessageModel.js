import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		conversationId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Conversation" 
    },
		sender: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User" 
    },
		text: {
      type: String
    },
    seen: {
      type: Boolean,
      default: false
    }, 
    img: {
      type: String,
      default: "",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
	},
	{ timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;