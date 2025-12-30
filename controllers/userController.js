const pool = require("../db/dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// =======================
// REGISTER
// =======================
exports.register = async (req, res) => {
  const { username, firstname, lastname, email, password } = req.body;

  if (!username || !firstname || !lastname || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if email already exists
    const [existing] = await pool.execute(
      "SELECT userid FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user without specifying userid (auto-increment INT)
    const [result] = await pool.execute(
      `
      INSERT INTO users (username, firstname, lastname, email, password)
      VALUES (?, ?, ?, ?, ?)
      `,
      [username, firstname, lastname, email, hashedPassword]
    );

    // Get auto-incremented user ID
    const userid = result.insertId;

    res.status(201).json({ message: "User registered successfully", userid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =======================
// LOGIN
// =======================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT with INT userid
    const token = jwt.sign(
      { userid: user.userid, email: user.email },
      process.env.JWT_SECRET || "SECRET_KEY",
      { expiresIn: "1d" }
    );

    delete user.password;

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =======================
// CHECK LOGGED-IN USER
// =======================
exports.checkUser = (req, res) => {
  res.json({
    message: "User is logged in",
    user: req.user,
  });
};
