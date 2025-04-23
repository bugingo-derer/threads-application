import express from "express";
const router = express.Router();
import { 
  followUnfollowUser, 
  getuserProfile, 
  loginUser, 
  logoutUser, 
  signupUser, 
  getSuggestedUsers, 
  updateUser, 
  freezeAccount
} from "../controllers/userController.js"
import protectRoute from "../middlewares/protectRoute.js"
import { forgotPassword, resetPassword } from "../controllers/passwordController.js";

router.get("/profile/:query", getuserProfile);
router.get("/suggested", protectRoute, getSuggestedUsers);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/followUnfollow/:id", protectRoute, followUnfollowUser);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.put("/update/:uid", protectRoute, updateUser);
router.put("/freezeAccount", protectRoute, freezeAccount);

export default router;