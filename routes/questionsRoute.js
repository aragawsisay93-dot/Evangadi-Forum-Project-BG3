
// import express from "express";
// import {
//   getAllQuestions,
//   getSingleQuestion,
//   createQuestion,
//   searchQuestions, // ✅ add this
// } from "../controllers/questionsController.js";
// import authMiddleware from "../middleware/authMiddleware.js";

// const router = express.Router();

// // ✅ SEARCH questions (MUST be before "/:id")
// router.get("/search", searchQuestions);

// // GET all questions
// router.get("/", getAllQuestions);

// // GET single question
// router.get("/:id", getSingleQuestion);

// // POST new question (protected)
// router.post("/", authMiddleware, createQuestion);

// export default router;

import express from "express";
import {
  getAllQuestions,
  getSingleQuestion,
  createQuestion,
  searchQuestions, // ✅ add this
} from "../controllers/questionsController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ SEARCH questions (MUST be before "/:id")
router.get("/search", searchQuestions);

// GET all questions
router.get("/", getAllQuestions);

// GET single question
router.get("/:id", getSingleQuestion);

// POST new question (protected)
router.post("/", authMiddleware, createQuestion);

export default router;
