import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadAvatar } from "../middleware/uploadAvatar.js";
import { updateAvatar } from "../controllers/profileController.js";

const router = express.Router();

// POST /api/profile/avatar
router.post(
  "/avatar",
  authMiddleware,
  uploadAvatar.single("avatar"),
  updateAvatar,
);

export default router;
