
import express from "express";
import {
  getAllQuestions,
  getSingleQuestion,
  createQuestion,
} from "../controllers/questionsController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all questions
router.get("/", getAllQuestions);

// GET single question
router.get("/:id", getSingleQuestion);

// POST new question (protected)
router.post("/", authMiddleware, createQuestion);

export default router;
