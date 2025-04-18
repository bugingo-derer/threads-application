import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import { app, server } from "./sockets/socket.js";

import userRoutes from "./routes/userRoutes.js"
import postsRoutes from "./routes/postRoutes.js"
import messagesRoutes from "./routes/messageRoutes.js"


dotenv.config();

//cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
})

//app level middlewares:
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

//api for routes:
app.use("/api/users", userRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/messages", messagesRoutes);

server.listen(port, async () => {
  console.log(`Server started at http://localhost:${process.env.PORT}`);
  await connectDB();
});