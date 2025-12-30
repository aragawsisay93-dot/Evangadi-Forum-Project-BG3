const pool = require("../db/dbConfig");

// =======================
// ADD ANSWER
// =======================
exports.addAnswer = async (req, res) => {
  const { questionid, answer_text } = req.body;
  const userid = req.user.userid; // INT from JWT

  if (!userid) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!questionid || !answer_text) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // answerid is auto-increment INT in DB
    await pool.execute(
      `INSERT INTO answers (userid, questionid, answer_text, created_at)
       VALUES (?, ?, ?, NOW())`,
      [userid, questionid, answer_text]
    );

    res.status(201).json({ message: "Answer added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =======================
// GET ANSWERS BY QUESTION
// =======================
exports.getAnswers = async (req, res) => {
  const { questionid } = req.params;

  try {
    const [rows] = await pool.execute(
      `
      SELECT a.*, u.username
      FROM answers a
      JOIN users u ON a.userid = u.userid
      WHERE a.questionid = ?
      ORDER BY a.created_at DESC
      `,
      [questionid]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
