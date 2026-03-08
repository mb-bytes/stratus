if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoDB = require("./db.js");
const path = require("path");
const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const session = require("express-session");
const MongoStore = require("connect-mongo").default;
const User = require("./models/users.js");
const userRoutes = require("./routes/user.js");
const jobRoutes = require("./routes/dashboard.js");
const noteRoutes = require("./routes/notes.js");

let dbUrl = process.env.MONGO_URL;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  }),
);

app.use("/assets", express.static(path.join(__dirname, "assets")));

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
};
app.use(session(sessionOptions));
store.on("error", (err) => {
  console.log("Error in Mongo Session Store: ", err);
});

const passport = require("./config/passport.js");
app.use(passport.initialize());
app.use(passport.session());

// Auth status endpoint
app.get("/api/auth/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        username: req.user.username,
        email: req.user.email,
        isGoogleUser: !!(req.user.googleId && !req.user.hash),
      },
    });
  } else {
    res.status(401).json({ user: null });
  }
});

app.use("/api/auth", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/notes", noteRoutes);

// JSON error handler
app.use((err, req, res, next) => {
  let { status = 500, message = "An error occurred" } = err;
  console.error(err);
  res.status(status).json({ error: message });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server Started on port ${port}`);
});
