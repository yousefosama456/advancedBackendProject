const User = require("../models/user.model");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const myuser = await User.findOne({ email });
  if (!myuser) {
    return res.status(404).json({ message: "Error,email not found" });
  }
  const correctPassword = await myuser.correctPassword(password);
  if (!correctPassword) {
    return res.status(401).json({ message: "invalid password" });
  }
  res.status(200).json({ message: "you are logged in" });
};
