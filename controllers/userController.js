import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import db from "../db/dbConfig.js";

const normalizeEmail = (email) =>
  String(email || "")
    .trim()
    .toLowerCase();
const isBcryptHash = (str) => typeof str === "string" && str.startsWith("$2");

// ✅ helper: hash token before storing in DB
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

// ==========================
// REGISTER
// ==========================
export const register = async (req, res, next) => {
  try {
    let { username, firstname, lastname, email, password } = req.body;

    username = String(username || "").trim();
    firstname = String(firstname || "").trim();
    lastname = String(lastname || "").trim();
    email = normalizeEmail(email);
    password = String(password || "");

    if (!username || !firstname || !lastname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const [existing] = await db.query(
      "SELECT userid FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (username, firstname, lastname, email, password) VALUES (?,?,?,?,?)",
      [username, firstname, lastname, email, hashedPassword]
    );

    return res.status(201).json({
      message: "User registered successfully",
      userid: result.insertId,
    });
  } catch (err) {
    next(err);
  }
};

// ==========================
// LOGIN
// ==========================
export const login = async (req, res, next) => {
  try {
    let { email, password } = req.body;

    email = normalizeEmail(email);
    password = String(password || "");

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const [rows] = await db.query(
      "SELECT userid, username, firstname, lastname, email, password, avatar_url FROM users WHERE email = ? LIMIT 1",
      [email],
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const userRow = rows[0];
    const stored = userRow.password;

    let isMatch = false;

    // ✅ bcrypt
    if (isBcryptHash(stored)) {
      isMatch = await bcrypt.compare(password, stored);
    } else {
      // ✅ legacy plaintext support
      isMatch = password === stored;

      // ✅ auto upgrade plaintext to bcrypt
      if (isMatch) {
        const newHash = await bcrypt.hash(password, 10);
        await db.query("UPDATE users SET password = ? WHERE userid = ?", [
          newHash,
          userRow.userid,
        ]);
      }
    }

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET is not set in .env" });
    }

    const token = jwt.sign(
      {
        userid: userRow.userid,
        email: userRow.email,
        username: userRow.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const user = {
      userid: userRow.userid,
      username: userRow.username,
      firstname: userRow.firstname,
      lastname: userRow.lastname,
      email: userRow.email,
      avatar_url: userRow.avatar_url,
    };

    return res.json({ message: "Login successful", token, user });
  } catch (err) {
    next(err);
  }
};

// ==========================
// CHECK USER
// ==========================
export const checkUser = (req, res) => {
  return res.json({ message: "User is logged in", user: req.user });
};

// ==========================
// FORGOT PASSWORD
// POST /api/user/forgot-password
// ==========================
export const forgotPassword = async (req, res, next) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const [rows] = await db.query(
      "SELECT userid, email FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    // ✅ Always return same message (avoid revealing if email exists)
    if (rows.length === 0) {
      return res.json({
        message: "If this email exists, a reset link was sent.",
      });
    }

    const user = rows[0];

    // 1) generate raw token for URL
    const rawToken = crypto.randomBytes(32).toString("hex");

    // 2) hash token for DB storage
    const tokenHash = hashToken(rawToken);

    // 3) set expiry (15 minutes)
    const exp = new Date(Date.now() + 15 * 60 * 1000);

    await db.query(
      "UPDATE users SET reset_token_hash = ?, reset_token_exp = ? WHERE userid = ?",
      [tokenHash, exp, user.userid]
    );

    // ✅ Build reset link (FRONTEND URL)
    // Put your real client URL in .env as CLIENT_URL (recommended)
    const clientURL = process.env.CLIENT_URL || "http://localhost:5173";
    const resetLink = `${clientURL}/reset-password?token=${rawToken}`;

    // ✅ For now return link (development). In production, EMAIL IT instead.
    return res.json({
      message: "If this email exists, a reset link was sent.",
      resetLink,
    });
  } catch (err) {
    next(err);
  }
};

// ==========================
// RESET PASSWORD
// POST /api/user/reset-password
// body: { token, password }
// ==========================
export const resetPassword = async (req, res, next) => {
  try {
    const token = String(req.body.token || "").trim();
    const password = String(req.body.password || "");

    if (!token || !password) {
      return res
        .status(400)
        .json({ message: "Token and password are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    const tokenHash = hashToken(token);

    // find user with valid token and not expired
    const [rows] = await db.query(
      `SELECT userid
       FROM users
       WHERE reset_token_hash = ?
         AND reset_token_exp IS NOT NULL
         AND reset_token_exp > NOW()
       LIMIT 1`,
      [tokenHash]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        message: "Invalid or expired reset token. Please request a new one.",
      });
    }

    const { userid } = rows[0];

    const newHashedPassword = await bcrypt.hash(password, 10);

    // update password + clear reset token fields
    await db.query(
      `UPDATE users
       SET password = ?,
           reset_token_hash = NULL,
           reset_token_exp = NULL
       WHERE userid = ?`,
      [newHashedPassword, userid]
    );

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};
