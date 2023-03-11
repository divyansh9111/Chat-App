const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
//User registration api
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password,  confirmPassword,picture } = req.body;
  if (!name || !email || !password || !confirmPassword) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }
  //if user with the given email already exists
  const foundUser = await User.findOne({ email });
  if (foundUser) {
    res.status(400);
    throw new Error("User already exists");
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
      expires: new Date(Date.now() + 60*1000*60),
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
        expires: new Date(Date.now() + 60*1000*60),
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
const allUsers=asyncHandler(async(req,res)=>{
  const keyword=req.query.search?
  {
    $or:[
      {name:{$regex:req.query.search,$options:"i"}},
      {email:{$regex:req.query.search,$options:"i"}},
    ]
  }
  :{};
  const users=await User.find(keyword).find({_id:{$ne:req.user._id}});
  // console.log("userController.js 92"+req.user._id);
  // console.log("userController.js 92"+users);
  res.send({users});
});

module.exports = { registerUser, authUser ,allUsers};
