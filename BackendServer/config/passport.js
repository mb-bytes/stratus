const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const User = require("../models/users.js");

passport.use(new LocalStrategy(User.authenticate()));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:8080/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          const emailPrefix = profile.emails[0].value.split("@")[0];
          const randomSuffix = Math.floor(Math.random() * 10000);
          const username = `${emailPrefix}_${randomSuffix}`;

          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            username: username,
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    },
  ),
);

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL:
        process.env.GITHUB_CALLBACK_URL ||
        "http://localhost:8080/api/auth/github/callback",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });
        if (!user) {
          user = await User.create({
            githubId: profile.id,
            name: profile.displayName || profile.username,
            username: profile.username,
            email: profile.emails?.[0]?.value || "",
            profileUrl: profile.profileUrl,
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    },
  ),
);

module.exports = passport;
