import { Post } from "../Schema/postSchema.js";
import { Comment } from "../Schema/commentSchema.js";
export const postComment = async (req, res) => {
  const { user_id, comment, post_id, parent_id, target_user } = req.body;

  const newComment = await Comment.create({
    user_id,
    comment,
    post_id,
    parent_id,
    target_user,
    created_At: new Date().toISOString(),
  });

  if (parent_id) {
    await Comment.findByIdAndUpdate(
      parent_id,
      {
        $push: {
          child_id: newComment._id,
        },
      },
      { new: true }
    );
  } else {
    await Post.findByIdAndUpdate(post_id, {
      $push: {
        comments: newComment._id,
      },
    });
  }
  const posts = await Post.find({})
    .populate("user")
    .populate({
      path: "comments",
      populate: {
        path: "user_id",
      },
    });
  res.json({ data: posts });
};

export const editComment = async (req, res) => {
  const { comment } = req.body;
  const commentUpdated = await Comment.findByIdAndUpdate(
    req.params.id,
    {
      comment,
    },
    { new: true }
  );
  res.json({ data: commentUpdated });
};

export const likeComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  const isLike = comment.like.find((id) => id == req.user_id);
  if (isLike) {
    comment.like = comment.like.filter((id) => id !== req.user_id);
  } else {
    comment.like.push(req.user_id);
  }
  const updated = await Comment.findByIdAndUpdate(req.params.id, comment, {
    new: true,
  });
  res.json({ data: updated });
};

export const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  await Comment.findByIdAndDelete(req.params.id);

  if (comment.parent_id) {
    const parent_comment = await Comment.findById(comment.parent_id);
    parent_comment.child_id = parent_comment.child_id.filter(
      (id) => id !== String(comment._id)
    );
    await Comment.findByIdAndUpdate(
      comment.parent_id,

      parent_comment,

      { new: true }
    );
  }
  const posts = await Post.find({})
    .populate("user")
    .populate({
      path: "comments",
      populate: {
        path: "user_id",
      },
    });
  res.json({ data: posts });
};
