import express from "express";
import {
  getAnswersByQuestion,
  createAnswer,
  updateAnswer,
  deleteAnswer,
  reactToAnswer,
  getCommentsByAnswer,
  createComment,
} from "../controllers/answersController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET answers for a question
router.get("/:questionId", getAnswersByQuestion);

// POST answer (protected)
router.post("/:questionId", authMiddleware, createAnswer);

// ✅ EDIT answer (protected)
router.put("/:answerId", authMiddleware, updateAnswer);

// ✅ DELETE answer (protected)
router.delete("/:answerId", authMiddleware, deleteAnswer);

// ✅ LIKE/DISLIKE toggle (protected)
router.post("/:answerId/react", authMiddleware, reactToAnswer);

// ✅ COMMENTS
router.get("/:answerId/comments", getCommentsByAnswer);
router.post("/:answerId/comments", authMiddleware, createComment);

export default router;
