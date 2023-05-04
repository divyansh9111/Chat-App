const asyncHandler = require("express-async-handler");
const Chat = require("../model/chatModel");
const Message = require("../model/messageModel");
const User = require("../model/userModel");
const nodemailer = require("nodemailer");
require("dotenv").config();
//User registration api
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword, picture } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }
  //if user with the given email already exists
  const foundUser = await User.findOne({ email });
  if (foundUser) {
    res.status(400);
    throw new Error("User already exists with this email!");
  }
  if (password === confirmPassword) {
    const newUser = new User({
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
      picture: picture,
    });
    const token = await newUser.generateAuthToken();
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 60 * 1000 * 60),
      httpOnly: true,
    });
    await newUser.save();

    if (newUser) {
      res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        confirmPassword: newUser.confirmPassword,
        picture: newUser.picture,
        token: newUser.token,
      });
      console.log("New user created");
    } else {
      res.status(400);
      throw new Error("Failed to create user");
    }
  } else {
    res.status(400);
    throw new Error("password and confirm password are not matching");
  }
});

//User authentication api
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }
  const foundUser = await User.findOne({ email });
  if (foundUser) {
    if (await foundUser.matchPassword(password)) {
      const token = await foundUser.generateAuthToken();
      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 60 * 1000 * 60),
        httpOnly: true,
      });
      res.status(200).json({
        _id: foundUser._id,
        name: foundUser.name,
        email: foundUser.email,
        picture: foundUser.picture,
        token: token,
      });
    } else {
      res.status(400);
      throw new Error("Invalid login details!");
    }
  } else {
    res.status(400);
    throw new Error("No user found with this email!");
  }
});

// /api/user?search=ajay
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  // console.log("userController.js 92"+req.user._id);
  // console.log("userController.js 92"+users);
  res.send({ users });
});
const sendVerificationCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Generate a random verification code
  const generateCode = () => Math.floor(Math.random() * 10000).toString();
  const code = generateCode();

  try {
    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER_EMAIL, // Your email address
        pass: process.env.USER_PASS, // Your email password
      },
      envelope: {
        from: process.env.USER_EMAIL,
        to: email,
      },
    });

    // Set up mail options
    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "Email Verification",
      // text: `Your verification code is ${code}`
      html: ` <!DOCTYPE html>
  <html>
  <head>
      <title>Email Verification Code</title>
      <style>
          body {
              font-family: Arial, Helvetica, sans-serif;
              background-color: #ffffff;
              color: #000000;
              font-size: 16px;
          }
  
          h1 {
              text-align: center;
              margin-top: 50px;
          }
  
          p {
              margin-top: 30px;
              text-align: center;
          }
  
          .code {
              font-size: 24px;
              font-weight: bold;
              margin-top: 20px;
              text-align: center;
          }\n\n        .button {
              background-color: #007bff;
              border: none;
              color: #ffffff;
              padding: 10px 20px;
              text-align: center;
              text-decoration: none;
              display: inline-block;
              font-size: 16px;
              margin-top: 30px;
          }
  
          .button:hover {
              background-color: #0062cc;
          }
      </style>
  </head>
  <body>
      <h1>Email Verification Code</h1>
      <p>Thank you for registering! Your verification code is:</p>
      <p class="code">${code}</p>
      <p>Please enter this code into the verification field to complete your registration.</p>
  </body>
  </html>
  `,
    };

    // Send mail
    let abc = await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send("Failed to send email");
      } else {
        console.log("Email sent: " + info.rejected);
        res.send(code);
      }
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});
const resetPassword = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      foundUser.password = password;
      foundUser.confirmPassword = password;
      await foundUser.save();
      res.status(200).send(foundUser);
    } else {
      res.status(400);
      throw new Error("No user found with this email!");
    }
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
module.exports = {
  registerUser,
  authUser,
  allUsers,
  sendVerificationCode,
  resetPassword,
};
