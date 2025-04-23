import _ from "lodash";
import User from "../models/userModel.js";
import sendEmail from "../utils/email.js";
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import Joi from "joi";

export const forgotPassword = async (req, res, next) => {
  const email = _.get(req.body, "email");
  try {
    const user = await User.findOne({email: email});
    if(!user) return res.status(400).json({error: "We could not find user with given email"});

    const resetToken = user.createPasswordResetToken();
    await user.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/api/users/resetPassword/${resetToken}`;
    const message = `We received a request to reset the password for your account. Please use the below link to reset your password`;

    
    try {
      await sendEmail({
        email: user.email,
        subject: 'Password change request received',
        message,
        url: resetUrl
      });

      return res.status(200).json({ message: "password reset link send to user email", resetUrl });
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpires = undefined;
      user.save();

      console.log(err);
      return res.status(500).json({error: "There was error why sending email. Please try again"})
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: error.message});
  }
}

export const resetPassword = async (req, res, next) => {
  const resetToken = _.get(req.params, "token");
  const newPassword = req.body.password;
  try {
    const token = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user = await User.findOne({resetPasswordToken: token, resetPasswordTokenExpires: {$gt: Date.now()}});
    if(!user) return res.status(400).json({error: "Invalid or expired reset token"});

    if(newPassword.length < 6) return res.status(400).json({error: "Password must be at least 6 characters"});
    const saltnumber = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltnumber);

    user.password = hashedPassword
    user.resetPasswordToken = undefined,
    user.resetPasswordTokenExpires = undefined,
    user.updatedAt = Date.now();

    user.save()

    return res.status(201).json({user, token});

  } catch (error) {
    console.log(error);
    return res.status(500).json({error: error.message});
  }
}
