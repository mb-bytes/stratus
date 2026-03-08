const express = require("express");
const router = express.Router();
const { newMessage, validateMessage } = require("../controllers/contact");

router.post("/", validateMessage, newMessage);

module.exports = router;
