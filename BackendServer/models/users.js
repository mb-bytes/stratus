const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema(
  {
    googleId: String,
    githubId: String,
    name: {
      type: String,
      required: false,
    },
    username: {
      type: String,
    },
    email: {
      type: String,
      required: false,
    },
    profileUrl: {
      type: String,
    },
  },
  { timestamps: true },
);

const validateUser = (req, res, next) => {
  let { error } = User.validate(req.body);
  if (error) {
    let messages = error.details.map((el) => el.message);
    req.flash("failure", messages);
    res.redirect("/auth/signup");
  } else {
    next();
  }
};

userSchema.plugin(passportLocalMongoose);

userSchema.post("findOneAndDelete", async function (user) {
  if (user) {
    const Job = require("./jobs.js");
    const Note = require("./note.js");
    await Job.deleteMany({ user_id: user._id });
    await Note.deleteMany({ user_id: user._id });
  }
});

module.exports = mongoose.model("User", userSchema);
