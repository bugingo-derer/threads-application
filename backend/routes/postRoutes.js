import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import { 
  createPost, 
  deletePosts, 
  forwardPost, 
  getFeedPosts, 
  getPost,
  getRandomPosts,
  getUserPosts, 
  likeUnlikePost, 
  replyToPost,
} from "../controllers/postController.js";
const router = express.Router();

router.get("/randomPosts", getRandomPosts)
router.get("/feed",protectRoute, getFeedPosts)
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts)
router.post("/create", protectRoute, createPost)
router.post("/forwardPost/:id",protectRoute, forwardPost)
router.delete("/:id", protectRoute, deletePosts)
router.put("/like/:lid", protectRoute, likeUnlikePost)
router.put("/reply/:pid", protectRoute, replyToPost)

export default router;