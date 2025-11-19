const User = require("../models/user.model");
const jwt = require('jsonwebtoken')

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.SECRET_KEY,{expiresIn:process.env.JWT_EXPIRES_IN}
  );
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const myuser = await User.findOne({ email });
  if (!myuser) {
    return res.status(404).json({ message: "error,invalid email or password" });
  }
  const correctPassword = await myuser.correctPassword(password);
  if (!correctPassword) {
    return res.status(401).json({ message: "error,invalid email or password" });
  }
  const token=signToken(myuser);
  res.status(200).json({ message: "you are logged in" ,data:token});
  
};

