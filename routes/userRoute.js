
import express from "express";
import {
  register,
  login,
  checkUser,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/checkUser", auth, checkUser);

// ✅ NEW
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
