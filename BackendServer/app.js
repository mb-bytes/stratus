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

const User = require("./models/users.js");
const userRoutes = require("./routes/user.js");
const jobRoutes = require("./routes/dashboard.js");
const noteRoutes = require("./routes/notes.js");
const msgRoutes = require("./routes/message.js");

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

const passport = require("./config/passport.js");
app.use(passport.initialize());

const jwt = require("jsonwebtoken");

app.get("/api/auth/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(200).json({ user: null });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decoded.id);

    if (user) {
      res.json({
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
        },
      });
    } else {
      res.status(200).json({ user: null });
    }
  } catch (err) {
    res.status(200).json({ user: null });
  }
});

app.use("/api/auth", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/message", msgRoutes);

app.use((err, req, res, next) => {
  let { status = 500, message = "An error occurred" } = err;
  console.error(err);
  res.status(status).json({ error: message });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server Started on port ${port}`);
});
