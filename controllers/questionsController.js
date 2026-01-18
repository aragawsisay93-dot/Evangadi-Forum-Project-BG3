import db from "../db/dbConfig.js";

// ✅ GET all questions (with username)
export const getAllQuestions = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        q.questionid,
        q.userid,
        q.title,
        q.description,
        q.tag,
        q.created_at,
        u.username
      FROM questions q
      JOIN users u ON q.userid = u.userid
      ORDER BY q.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error("❌ getAllQuestions error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ GET single question (with username)
export const getSingleQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT 
        q.questionid,
        q.userid,
        q.title,
        q.description,
        q.tag,
        q.created_at,
        u.username
      FROM questions q
      JOIN users u ON q.userid = u.userid
      WHERE q.questionid = ?
      `,
      [Number(id)]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("❌ getSingleQuestion error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ POST question (protected)
export const createQuestion = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user?.userid;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "title and description are required" });
    }

    await db.query(
      "INSERT INTO questions (title, description, userid) VALUES (?, ?, ?)",
      [title, description, userId]
    );

    res.status(201).json({ message: "Question created successfully" });
  } catch (error) {
    console.error("❌ createQuestion error:", error);
    res.status(500).json({ message: error.message });
  }
};
