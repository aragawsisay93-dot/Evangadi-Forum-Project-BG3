const express = require("express");
const router = express.Router();
const {
  createQuestion,
  getQuestions,
} = require("../controllers/questionsController");
const authenticateToken = require("../middleware/authMiddleware"); 


// Protected route to create question
router.post("/", authenticateToken, createQuestion);

// Public route to get all questions
router.get("/", getQuestions);

module.exports = router;
