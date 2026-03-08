const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboard.js");
const { asyncWrap, isLoggedIn } = require("../middlewares.js");

router.get("/", isLoggedIn, asyncWrap(dashboardController.index));

router.post(
  "/",
  isLoggedIn,
  dashboardController.validateJob,
  asyncWrap(dashboardController.postJob),
);

router.put(
  "/:id/status",
  isLoggedIn,
  asyncWrap(dashboardController.updateJobStatus),
);

router.put("/:id/notes", isLoggedIn, asyncWrap(dashboardController.addNotes));

router.delete("/:id", isLoggedIn, asyncWrap(dashboardController.deleteJob));

module.exports = router;
