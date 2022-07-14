import multer from "multer";
import fs from "fs";
import { Post } from "../Schema/postSchema.js";
import { User } from "../Schema/userSchema.js";
const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const { text, user_id } = req.body;
    const post = await Post.create({
      user: user_id,
      text: text,
      created_At: Date.now(),
    });

    req.post_id = post._id;

    const folderName = "post_" + post._id;
    const dir = "../client/public/Posts/" + folderName;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        req.body.text.substring(0, 5) +
        "_" +
        file.originalname
    );
  },
});

const upload_profile = multer.diskStorage({
  destination: async function (req, file, cb) {
    const user = await User.findById(req.user_id);
    const folderName = "profile_" + user._id;
    const dir = "../client/public/Profile/" + folderName;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: async function (req, file, cb) {
    if (file) {
      const user = await User.findById(req.user_id);

      cb(null, file.fieldname + "-" + user._id + "_" + file.originalname);
    }
  },
});

const update_file = multer.diskStorage({
  destination: async function (req, file, cb) {
    const post = await Post.findById(req.params.id);
    const folderName = "post_" + post._id;
    const dir = "../client/public/Posts/" + folderName;

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    if (file) {
      cb(
        null,
        file.fieldname +
          "-" +
          req.body.text.substring(0, 5) +
          "_" +
          file.originalname
      );
    }
  },
});
export const uploadFile = multer({ storage: storage });
export const updateFile = multer({ storage: update_file });
export const uploadProfile = multer({ storage: upload_profile });
