import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  req.header("Access-Control-Allow-Origin", "*");

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "secrect");
    req.user_id = decoded.id;
    next();
  } catch (err) {
    res.json({ err });
    console.log(err);
  }
};

export const admin = (req, res, next) => {
  req.header("Access-Control-Allow-Origin", "*");

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "secrect");
    if (decoded.role == "admin") {
      req.user_id = decoded.id;

      console.log(decoded.role);
      next();
    }
  } catch (err) {
    res.json({ err });
    console.log(err);
  }
};
