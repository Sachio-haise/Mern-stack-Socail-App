import { User } from "../Schema/userSchema.js";
import jwt from "jsonwebtoken";
import { sentMail } from "../email.js";
import { EmailTemplate } from "../emailTemplate.js";
import bcrypt from "bcryptjs";
const maxAge = 3 * 24 * 60 * 60;
const handleError = (error) => {
  const errors = { name: "", email: "", password: "" };
  if (error.message.includes("users validation failed")) {
    Object.values(error.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  if (error.code == "11000") {
    errors["email"] = "Email already exist!";
  }
  return errors;
};

export const SignIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.json({ errors: { email: "Email doesn't exist!" } });
      return;
    }
    const check_pwd = await bcrypt.compare(password, user.password);
    if (!check_pwd) {
      res.json({ errors: { password: "Wrong Password!" } });
      return;
    }
    if (user.email_verify_at == null) {
      try {
        const email_verify_token = jwt.sign(
          { email: user.email, id: user._id, role: user.isAdmin },
          "secrect",
          {
            expiresIn: "1h",
          }
        );
        const token = jwt.sign(
          { email: user.email, id: user._id, role: user.isAdmin },
          "secrect",
          {
            expiresIn: maxAge,
          }
        );
        const url = `https://mern-social-app-2022.herokuapp.com/verify/${email_verify_token}`;
        const html = EmailTemplate({ url });
        sentMail({
          to: user.email,
          subject: "Verify email",
          text: "Verify it is you!",
          html: html,
        });
        res.json({ user, token });
        return;
      } catch (err) {
        console.log(err);
      }
    }

    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.isAdmin },
      "secrect",
      {
        expiresIn: maxAge,
      }
    );
    res.json({ user, token });
  } catch (err) {
    console.log(err);
  }
};

export const SignUp = async (req, res) => {
  const { name, password, email } = req.body;

  try {
    const user = await User.create({ name, email, password });
    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.isAdmin },
      "secrect",
      {
        expiresIn: maxAge,
      }
    );
    const email_verify_token = jwt.sign(
      { email: user.email, id: user._id, role: user.isAdmin },
      "secrect",
      { expiresIn: "1h" }
    );
    if (user.email_verify_at == null) {
      try {
        const url = `https://mern-social-app-2022.herokuapp.com/verify/${email_verify_token}`;
        const html = EmailTemplate({ url });
        sentMail({
          to: user.email,
          subject: "Verify email",
          text: "Verify it is you!",
          html: html,
        });
        return res.json({ user, token });
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    const errors = handleError(err);
    return res.json({ errors });
  }
};

export const forgetPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email);

  const user = await User.findOne({ email: email });
  if (!user) {
    res.json({ errors: { email: "Email doesn't exist!" } });
    return;
  }
  const ramdom = Math.floor(Math.random() * (999999 - 100000)) + 100000;
  console.log(ramdom);
  const token = jwt.sign(
    { email: user.email, id: user._id, ramdom: ramdom, role: user.isAdmin },
    "secrect",
    {
      expiresIn: "1h",
    }
  );
  try {
    const url = `https://snazzy-lokum-0710bb.netlify.app/reset-password`;
    const html = EmailTemplate({ url, ramdom });
    sentMail({
      to: user.email,
      subject: "Password Reset email",
      text: "Click to reset password.",
      html: html,
    });
    return res.json({ user, token });
  } catch (err) {
    console.log(err);
  }
};

export const confirmCode = async (req, res) => {
  const { code } = req.body;
  const token = req.params.token;

  const decoded = jwt.decode(token);

  if (decoded.exp * 1000 < new Date().getTime()) {
    return;
  }

  if (decoded.ramdom != code) {
    res.json({ errors: { email: "Incorrect reset code." } });
    return;
  }
  res.json({ token });
};

export const resetPassword = async (req, res) => {
  const { password } = req.body;
  const token = req.params.token;

  const decoded = jwt.decode(token);

  if (decoded.exp * 1000 < new Date().getTime()) {
    return;
  }
  const salt = await bcrypt.genSalt(10);

  const user = await User.findByIdAndUpdate(
    decoded.id,
    {
      password: await bcrypt.hash(password, salt),
    },
    { new: true }
  );
  res.json({ user });
};

export const resent = async (req, res) => {
  const token = req.body.token;
  const decoded = jwt.decode(token);

  if (token.exp * 1000 < new Date().getTime()) {
    console.log("token expire");

    res.json({ decoded });
  } else {
    const user_id = decoded.id;
    const user = await User.findById(user_id);

    if (user) {
      const email_verify_token = jwt.sign(
        { email: user, id: user._id, role: user.isAdmin },
        "secrect",
        { expiresIn: "1h" }
      );
      if (user.email_verify_at == null) {
        try {
          const url = `https://mern-social-app-2022.herokuapp.com/verify/${email_verify_token}`;
          const html = EmailTemplate({ url });
          sentMail({
            to: user.email,
            subject: "Verify email",
            text: "Verify it is you!",
            html: html,
          });
          return res.json({ user, token });
        } catch (err) {
          console.log(err);
        }
      } else {
        res.json({ user, token });
      }
    }
  }
};

export const verify = async (req, res) => {
  const token = req.params.token;
  const decoded = jwt.decode(token);
  console.log(decoded);
  if (decoded.exp * 1000 < new Date().getTime()) {
    return;
  } else {
    const user = await User.findByIdAndUpdate(
      decoded.id,
      {
        email_verify_at: new Date().toISOString(),
      },
      { new: true }
    );
    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.isAdmin },
      "secrect",
      {
        expiresIn: maxAge,
      }
    );
    const reset_token = jwt.sign({ user, token }, "secrect", {
      expiresIn: maxAge,
    });
    res.redirect(
      "https://mern-social-app-frontend2022.herokuapp.com/verified/" +
        reset_token
    );
  }
};

export const updateBio = async (req, res) => {
  const { bio } = req.body;
  var user;
  const path = "https://mern-social-app-2022.herokuapp.com/images/Profiles/";

  if (req.file) {
    const profile =
      path +
      "/profile_" +
      req.user_id +
      "/" +
      req.file.fieldname +
      "-" +
      req.user_id +
      "_" +
      req.file.originalname;
    user = await User.findByIdAndUpdate(
      req.user_id,
      {
        bio,
        profile,
      },
      { new: true }
    );
  } else {
    user = await User.findByIdAndUpdate(
      req.user_id,
      {
        bio,
      },
      { new: true }
    );
  }
  res.json({ data: user });
};

export const updateProfile = async (req, res) => {
  const { email, oldPassword, password, name } = req.body;
  const user = await User.findById(req.user_id);
  if (password !== "") {
    const check_pwd = await bcrypt.compare(oldPassword, user.password);
    if (!check_pwd) {
      return res.json({ errors: { password: "Wrong Password!" } });
    }
    const salt = await bcrypt.genSalt(10);

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        email,
        name,
        password: await bcrypt.hash(password, salt),
      },
      { new: true }
    );
    res.json({ data: updatedUser });
  } else {
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        email,
        name,
      },
      { new: true }
    );
    res.json({ data: updatedUser });
  }
};

export const me = async (req, res) => {
  const token = req.body.token;
  const decoded = jwt.decode(token);
  if (decoded.exp * 1000 < new Date().getTime()) {
    res.json({});
  } else {
    const user = await User.findById(decoded.id);
    if (user) {
      const token = jwt.sign(
        { email: user.email, id: user._id, role: user.isAdmin },
        "secrect",
        {
          expiresIn: maxAge,
        }
      );
      res.json({ user, token });
    }
  }
};
