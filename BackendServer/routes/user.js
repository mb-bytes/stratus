const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/user.js");
const { asyncWrap, isLoggedIn } = require("../middlewares.js");

const jwt = require("jsonwebtoken");
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

const validateSignup = userController.validateSignup;
const validateLogin = userController.validateLogin;

router.post(
  "/login",
  validateLogin,
  (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res
          .status(401)
          .json({ error: info?.message || "Invalid username or password" });
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  asyncWrap(userController.postLogin),
);

router.post("/signup", validateSignup, asyncWrap(userController.postSignUp));

router.get("/logout", userController.logout);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

const handleOAuthCallback = (req, res) => {
  const token = jwt.sign(
    { id: req.user._id, username: req.user.username },
    process.env.SECRET,
    { expiresIn: "7d" },
  );
  res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
};

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${frontendUrl}/login?error=auth_failed`,
  }),
  handleOAuthCallback,
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], session: false }),
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${frontendUrl}/login?error=auth_failed`,
  }),
  handleOAuthCallback,
);

router.delete(
  "/delete-account",
  isLoggedIn,
  asyncWrap(userController.deleteAccount),
);

module.exports = router;
