import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  text: {
    type: String,
    required: [true, "Please fill the text field"],
  },
  file: {
    type: String,
    default: null,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comments",
    },
  ],
  like: {
    type: [String],
    default: [],
  },
  created_At: {
    type: Date,
    default: new Date(),
  },
  updated_At: {
    type: Date,
    default: null,
  },
});

export const Post = mongoose.model("posts", postSchema);
