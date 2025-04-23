import nodemailer from 'nodemailer';
import dotenv from 'dotenv'

dotenv.config();

const sendEmail = async (option) => {
  //Create the transporter : mail-trap:
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  //define email options:
  const emailOptions = {
    from: 'byiringirosamuel533@gmail.com',
    to: option.email,
    subject: option.subject,
    html: `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #4a90e2;">Password Reset Request</h2><br/>
      <a href=${option.url}>Reset your password</a><br/>
      <p>${option.url.split('/').pop()}<p/>
      <p>This reset password link will be valid for 10 minutes</p>
      <p>If you didn't request this password reset, please ignore this email.</p>
      <p>Thanks,<br />The Threads Team</p>
    </div>
  `,
  }

  await transporter.sendMail(emailOptions);
}

export default sendEmail;