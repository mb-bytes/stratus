const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/user.js");
const { asyncWrap, isLoggedIn } = require("../middlewares.js");

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

const validateSignup = userController.validateSignup;
const validateLogin = userController.validateLogin;

router.post(
  "/login",
  validateLogin,
  (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res
          .status(401)
          .json({ error: info?.message || "Invalid username or password" });
      }
      req.login(user, (err) => {
        if (err) return next(err);
        next();
      });
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
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${frontendUrl}/login?error=auth_failed`,
  }),
  (req, res) => {
    res.redirect(`${frontendUrl}/jobs`);
  },
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${frontendUrl}/login?error=auth_failed`,
  }),
  (req, res) => {
    res.redirect(`${frontendUrl}/jobs`);
  },
);

router.delete(
  "/delete-account",
  isLoggedIn,
  asyncWrap(userController.deleteAccount),
);

module.exports = router;
