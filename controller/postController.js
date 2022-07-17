import { Post } from "../Schema/postSchema.js";
import { User } from "../Schema/userSchema.js";
import fs from "fs";
export const getPosts = async (req, res) => {
  var posts = await Post.find({})
    .populate("user")
    .populate({
      path: "comments",
      populate: {
        path: "user_id",
      },
    });
  posts = posts.sort((a, b) => {
    return new Date(b.created_At) - new Date(a.created_At);
  });
  res.json({ data: posts });
};

export const createPost = async (req, res) => {
  const { text, user_id } = req.body;
  const { file } = req.files;
  var post = await Post.create({
    user: user_id,
    text: text,
    created_At: new Date().toISOString(),
  });
  if (file) {
    const folderName = "post_" + post._id;
    const fileName = req.body.text.substring(0, 5) + "-" + file.name;
    const dir = "./Storage/Posts/" + folderName;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    file.mv(`${dir}/${fileName}`, (err) => {
      if (err) {
        console.error(err);
        res.status(500).send(err);
        return;
      }
    });
    const path = "http://localhost:5000/images/Posts/";
    await Post.findByIdAndUpdate(
      post._id,
      {
        file: path + folderName + "/" + fileName,
      },
      { new: true }
    );
  }

  await User.findByIdAndUpdate(
    user_id,
    {
      $push: {
        posts: post._id,
      },
    },
    { new: true }
  );
  const posts = await Post.find({}).populate("user");
  res.json({ data: posts });
};

export const editPost = async (req, res) => {
  const { text, user_id, file } = req.body;
  var post;
  if (file != "") {
    const folderName = "post_" + req.params.id;
    post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        text: text,
        user: user_id,
        updated_At: Date.now(),
        file:
          "Posts/" +
          folderName +
          "/" +
          req.file.fieldname +
          "-" +
          req.body.text.substring(0, 5) +
          "_" +
          req.file.originalname,
      },
      { new: true }
    );
  } else {
    post = await Post.findByIdAndUpdate(
      req.params.id,
      {
        text: text,
        user: user_id,
        updated_At: new Date().toISOString(),
      },
      { new: true }
    );
  }
  console.log(post);
  const posts = await Post.find({}).populate("user");

  res.json({ data: posts });
};

export const deletePost = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  const posts = await Post.find({}).populate("user");

  res.json({ data: posts });
};

export const likePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  const isLike = post.like.find((id) => id == String(req.user_id));
  if (isLike) {
    post.like = post.like.filter((id) => id !== String(req.user_id));
  } else {
    post.like.push(req.user_id);
  }
  const updatedPost = await Post.findByIdAndUpdate(req.params.id, post, {
    new: true,
  });
  const posts = await Post.find({}).populate("user");

  res.json({ data: posts });
};
