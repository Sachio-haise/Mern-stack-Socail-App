import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail.js";
import bcrypt from "bcryptjs";
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please fill the name field."],
  },
  email: {
    type: String,
    required: [true, "Please fill the email field."],
    unique: true,
    validate: [isEmail, "Please enter a valid email!"],
  },
  bio: {
    type: String,
    default: null,
  },
  password: {
    type: String,
    required: [true, "Please fill the password field."],
  },
  profile: {
    type: String,
    default: "./Profile/default.png.jpg",
  },
  isAdmin: {
    type: String,
    default: "user",
  },
  email_verify_at: {
    type: Date,
    default: null,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
    },
  ],
  created_at: {
    type: Date,
    default: new Date().toISOString(),
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User = mongoose.model("users", userSchema);
