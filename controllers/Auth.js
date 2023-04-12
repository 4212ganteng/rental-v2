import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import { Response } from "./helpers/response.js";

async function sendEmailVerification(email, emailVerificationCode) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  let info = await transporter.sendMail({
    from: `"Socialeg" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Socialeg | Email Verification",
    text: "Testing",
    html: `<a href="https://socialeg-be-staging-v1.up.railway.app/auth/verify-email/${emailVerificationCode}">Click this button to verify your email address</a>`,
  });

  console.log("Message sent: %s", info.messageId);
}

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // check if user email already exist below
    const user = await User.findOne({ email: email });
    if (user)
      return res
        .status(400)
        .json(Response.errorResponse(`Email ${email} Already Used!.`));
    // check if user email already exist above

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const emailVerificationCode = jwt.sign(
      { isEmailVerified: true },
      process.env.JWT_VERIFY_EMAIL
    );

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
    });
    const savedUser = await newUser.save();
    res
      .status(201)
      .json(Response.successResponse({ savedUser }, "Success create account"));

    sendEmailVerification(savedUser.email, emailVerificationCode).catch(
      console.error
    );
  } catch (err) {
    res.status(500).json(Response.errorResponse(err.message));
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json(Response.errorResponse("Email or Password Wrong!."));

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json(Response.errorResponse("Email or Password Wrong!."));

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    delete user.password;
    res
      .status(200)
      .json(
        Response.successResponse(
          { token, user },
          "Success Login To Your Account!."
        )
      );
  } catch (err) {
    res.status(500).json(Response.errorResponse(err.message));
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { emailVerificationCode } = req.params;
    console.log("this is your email code : ", emailVerificationCode);
    const checkCode = await User.findOne({ emailVerificationCode });

    if (!checkCode)
      return res
        .status(400)
        .json(Response.errorResponse("Wrong email verification code!"));

    checkCode.emailVerified = true;
    checkCode.emailVerificationCode = null;
    await checkCode.save();

    res
      .status(200)
      .json(
        Response.successResponse(
          null,
          "Your account has been verified successfully! You can now login, have fun! 😎"
        )
      );
  } catch (err) {
    res.status(500).json(Response.errorResponse(err.message));
  }
};
