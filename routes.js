import express from "express";
import {
  confirmCode,
  forgetPassword,
  me,
  resent,
  resetPassword,
  SignIn,
  SignUp,
  updateBio,
  updateProfile,
  verify,
} from "./controller/authController.js";
import multer from "multer";
import { admin, auth } from "./middleware/auth.js";
import {
  createPost,
  deletePost,
  editPost,
  getPosts,
  likePost,
} from "./controller/postController.js";
import { updateFile, uploadFile, uploadProfile } from "./middleware/upload.js";
import {
  deleteComment,
  editComment,
  likeComment,
  postComment,
} from "./controller/commentController.js";
import { getUsers } from "./controller/adminController.js";

const upload = multer();
const Router = express.Router();

Router.post("/sign-up", upload.none(), SignUp);
Router.post("/sign-in", upload.none(), SignIn);
Router.get("/verify/:token", verify);
Router.post("/resent", auth, upload.none(), resent);
Router.post("/me", auth, upload.none(), me);
Router.post("/update-profile", auth, upload.none(), updateProfile);
Router.post("/update-bio", auth, uploadProfile.single("profile"), updateBio);
Router.post("/forgot-password", upload.none(), forgetPassword);
Router.post("/confirm-code/:token", upload.none(), confirmCode);
Router.post("/reset-password/:token", upload.none(), resetPassword);

Router.get("/posts", getPosts);
Router.post("/create-post", auth, uploadFile.single("file"), createPost);
Router.post("/edit-post/:id", auth, updateFile.single("file"), editPost);
Router.delete("/delete-post/:id", auth, deletePost);
Router.get("/like-post/:id", auth, likePost);

Router.post("/comment-post/:id", auth, upload.none(), postComment);
Router.get("/comment-delete/:id", auth, deleteComment);
Router.get("/comment-like/:id", auth, likeComment);
Router.post("/comment-edit/:id", auth, upload.none(), editComment);

//Admin
Router.get("/admin/users", admin, getUsers);
export default Router;
