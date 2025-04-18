import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()

const genTokenAndSetToken = (user_Id, res) => {
  const token = jwt.sign({ user_Id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    samesite: "strict"
  });

  return token;
}

export default genTokenAndSetToken;