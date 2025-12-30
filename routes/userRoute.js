const express = require("express");
const router = express.Router();
const { login, register, checkUser } = require("../controllers/userController");

// Import the middleware
const authenticateToken = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route
router.get("/check", authenticateToken, checkUser);

module.exports = router;
