const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmPassword: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: true,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    tokens: [
      //IMP syntax
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPass) {
  return await bcrypt.compare(enteredPass, this.password);
};

userSchema.methods.generateAuthToken = async function () {
  try {
    const token = await jwt.sign({ _id: this._id }, `${process.env.JWTCODE}`); //toString used here bcs its an object and literal is imp here.
    console.log(token);
    this.tokens = this.tokens.concat({ token });

    await this.save();
    return token;
  } catch (error) {
    console.log("At usermodel.js 30" + error);
    throw new Error(error);
  }
};

//encrypting password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // console.log(this.password);
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = await bcrypt.hash(this.confirmPassword, 10);
    // console.log(this.password);
  }
  next();
});

const User = new mongoose.model("User", userSchema);
module.exports = User;
