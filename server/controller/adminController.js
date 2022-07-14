import { User } from "../Schema/userSchema.js";

export const getUsers = async (req, res) => {
  var users = await User.find({});

  users = users.sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });
  res.json({ users });
};
