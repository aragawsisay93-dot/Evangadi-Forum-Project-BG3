const pool = require("../db/dbConfig");

// =======================
// CREATE QUESTION
// =======================
exports.createQuestion = async (req, res) => {
  const { title, description, tag } = req.body;
  const userid = req.user.userid; // INT from JWT

  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Title and description are required" });
  }

  try {
    // Generate a questionid string (optional) to match VARCHAR(100) in DB
    const questionid = `Q-${Date.now()}`; // simple unique string

    await pool.execute(
      `INSERT INTO questions (questionid, userid, title, description, tag)
       VALUES (?, ?, ?, ?, ?)`,
      [questionid, userid, title, description, tag]
    );

    res
      .status(201)
      .json({ message: "Question created successfully", questionid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =======================
// GET ALL QUESTIONS
// =======================
exports.getQuestions = async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `
      SELECT q.questionid, q.title, q.description, q.tag, q.created_at, u.username
      FROM questions q
      JOIN users u ON q.userid = u.userid
      ORDER BY q.questionid DESC
      `
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
