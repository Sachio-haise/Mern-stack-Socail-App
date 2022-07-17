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
import { testone } from "./controller/testController.js";
import fileUpload from "express-fileupload";
const upload = multer();
const Router = express.Router();

Router.post("/api/sign-up", upload.none(), SignUp);
Router.post("/api/sign-in", upload.none(), SignIn);
Router.get("/api/verify/:token", verify);
Router.post("/api/resent", auth, upload.none(), resent);
Router.post("/api/me", auth, upload.none(), me);
Router.post("/api/update-profile", auth, upload.none(), updateProfile);
Router.post(
  "/api/update-bio",
  auth,
  uploadProfile.single("profile"),
  updateBio
);
Router.post("/api/forgot-password", upload.none(), forgetPassword);
Router.post("/api/confirm-code/:token", upload.none(), confirmCode);
Router.post("/api/reset-password/:token", upload.none(), resetPassword);

Router.get("/api/posts", getPosts);
Router.post("/api/create-post", auth, fileUpload(), createPost);
Router.post("/api/edit-post/:id", auth, updateFile.single("file"), editPost);
Router.delete("/api/delete-post/:id", auth, deletePost);
Router.get("/api/like-post/:id", auth, likePost);

Router.post("/api/comment-post/:id", auth, upload.none(), postComment);
Router.get("/api/comment-delete/:id", auth, deleteComment);
Router.get("/api/comment-like/:id", auth, likeComment);
Router.post("/api/comment-edit/:id", auth, upload.none(), editComment);

//Admin
Router.get("/api/admin/users", admin, getUsers);

//test image
Router.post("/api/test", fileUpload(), auth, testone);
export default Router;
