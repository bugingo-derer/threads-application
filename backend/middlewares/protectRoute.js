import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import User from "../models/userModel.js";

dotenv.config();

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if(!token) return res.status(401).json({ error: "Unauthorized" });

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decode.user_Id).select("-password");
    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute, middlware: ", error);
    return res.status(500).json({ error: error.message });
  }
}

export default protectRoute