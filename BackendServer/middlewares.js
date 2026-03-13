const jwt = require("jsonwebtoken");
const User = require("./models/users.js");

function asyncWrap(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => {
      next(err);
    });
  };
}

const isLoggedIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "You must be logged in to access this page" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "Invalid token or user no longer exists." });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = { asyncWrap, isLoggedIn };
