import express from 'express'
import protectRoute from '../middlewares/protectRoute.js'
import { sendMessage, getMessages, getConversations } from '../controllers/messageController.js'
const router = express.Router()

router.get("/:otherUserId", protectRoute, getMessages)
router.get("/", protectRoute, getConversations);
router.post("/", protectRoute, sendMessage)

export default router