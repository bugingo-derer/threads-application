import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { 
  createPost, 
  deletePosts, 
  getFeedPosts, 
  getPost, 
  getUserPosts, 
  likeUnlikePost, 
  replyToPost
} from "../controllers/postController.js";
const router = express.Router();

router.get("/feed",protectRoute, getFeedPosts)
router.get("/:id", getPost)
router.get("/user/:username", getUserPosts)
router.post("/create", protectRoute, createPost)
router.delete("/:id", protectRoute, deletePosts)
router.put("/like/:lid", protectRoute, likeUnlikePost)
router.put("/reply/:pid", protectRoute, replyToPost)

export default router;