import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
  comment: {
    type: String,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "posts",
  },
  child_id: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comments",
    },
  ],
  parent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "comments",
  },
  target_user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  like: {
    type: [String],
    default: [],
  },
  created_At: {
    type: Date,
    default: null,
  },
});

function autoPopulateSubs(next) {
  this.populate("child_id");
  this.populate("user_id");
  this.populate("post_id");
  this.populate("target_user");

  next();
}

commentSchema.pre("findOne", autoPopulateSubs).pre("find", autoPopulateSubs);

export const Comment = mongoose.model("comments", commentSchema);
