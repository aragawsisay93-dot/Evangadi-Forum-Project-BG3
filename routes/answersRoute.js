const express = require("express");
const router = express.Router();
const { addAnswer, getAnswers } = require("../controllers/answersController");
const authenticateToken = require("../middleware/authMiddleware"); // ✅ updated path

// Protected route to add an answer
router.post("/", authenticateToken, addAnswer);

// Public route to get answers for a question
router.get("/:questionid", getAnswers);

module.exports = router;
