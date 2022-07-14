import { User } from "../Schema/userSchema.js";

export const seedAdmin = async () => {
  const user = await User.findOne({ email: "aungkaungmyatkpg777@gmail.com" });
  if (!user) {
    await User.create({
      name: "陽翔",
      email: "aungkaungmyatkpg777@gmail.com",
      password: "password",
      bio: "Hi I am admin!",
      isAdmin: "admin",
      email_verify_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    });
    return;
  } else {
    return;
  }
};
