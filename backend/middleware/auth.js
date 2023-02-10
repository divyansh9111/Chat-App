require('dotenv').config();
const jwt=require('jsonwebtoken');
const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");

const auth=asyncHandler(async (req,res,next)=>{
    try {
       const token =req.cookies.jwt;
       console.log(token);
      const verifyUser= jwt.verify(token,`${process.env.JWTCODE}`);//returns user id
      const foundUser=await User.findById(verifyUser).select("-password -confirmPAssword");
      req.user=foundUser;
      req.token=token;
      next();
    } catch (error) {
        res.status(401);
        throw new Error("User is not authorized!");
    }
});
module.exports={auth};