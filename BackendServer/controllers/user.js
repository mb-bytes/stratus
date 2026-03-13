const User = require("../models/users.js");
const { signupSchema, loginSchema } = require("../schemaValid.js");
const jwt = require("jsonwebtoken");
const authenticate = User.authenticate();

module.exports.validateSignup = (req, res, next) => {
  const { error } = signupSchema.validate(req.body);
  if (error) {
    let messages = error.details.map((el) => el.message).join(", ");
    return res.status(400).json({ error: messages });
  }
  next();
};

module.exports.validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    let messages = error.details.map((el) => el.message).join(", ");
    return res.status(400).json({ error: messages });
  }
  next();
};

module.exports.postLogin = async (req, res) => {
  const token = jwt.sign(
    { id: req.user._id, username: req.user.username },
    process.env.SECRET,
    { expiresIn: "7d" },
  );

  res.json({
    message: "Login successful",
    token,
    user: {
      id: req.user._id,
      name: req.user.name,
      username: req.user.username,
      email: req.user.email,
      createdAt: req.user.createdAt,
    },
  });
};

module.exports.postSignUp = async (req, res) => {
  try {
    let { name, username, email, password } = req.body;
    let newUser = new User({
      name: name,
      username: username,
      ...(email && { email: email }),
    });
    const saveUser = await User.register(newUser, password);

    const token = jwt.sign(
      { id: saveUser._id, username: saveUser.username },
      process.env.SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: saveUser._id,
        name: saveUser.name,
        username: saveUser.username,
        email: saveUser.email,
        createdAt: saveUser.createdAt,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

module.exports.logout = (req, res) => {
  res.json({ message: "Logged out successfully" });
};

module.exports.deleteAccount = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is required." });
    }

    if (username !== req.user.username) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    await User.findByIdAndDelete(req.user._id);

    res.json({
      message:
        "Your account has been deleted successfully. We're sorry to see you go!",
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "Failed to delete account. Please try again." });
  }
};
