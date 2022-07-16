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
import cors from "cors";

const upload = multer();
const Router = express.Router();

Router.use(cors());
Router.all(function (req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://mern-social-app-frontend2022.herokuapp.com"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

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
Router.post(
  "/api/create-post",
  auth,
  cors(),
  uploadFile.single("file"),
  createPost
);
Router.post(
  "/api/edit-post/:id",
  auth,
  cors(),
  updateFile.single("file"),
  editPost
);
Router.delete("/api/delete-post/:id", cors(), auth, deletePost);
Router.get("/api/like-post/:id", auth, likePost);

Router.post("/api/comment-post/:id", auth, upload.none(), postComment);
Router.get("/api/comment-delete/:id", auth, deleteComment);
Router.get("/api/comment-like/:id", auth, likeComment);
Router.post("/api/comment-edit/:id", auth, upload.none(), editComment);

//Admin
Router.get("/api/admin/users", admin, getUsers);
export default Router;
