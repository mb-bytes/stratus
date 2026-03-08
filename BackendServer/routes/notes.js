const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notes.js");
const { asyncWrap, isLoggedIn } = require("../middlewares.js");

router.get("/", isLoggedIn, asyncWrap(notesController.getAllNotes));
router.post("/", isLoggedIn, asyncWrap(notesController.createNote));
router.put("/:id", isLoggedIn, asyncWrap(notesController.updateNote));
router.delete("/:id", isLoggedIn, asyncWrap(notesController.deleteNote));

module.exports = router;
