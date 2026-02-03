// import db from "../db/dbConfig.js";

// // ✅ GET all questions (with username)
// export const getAllQuestions = async (req, res) => {
//   try {
//     const [rows] = await db.query(`
//       SELECT
//         q.questionid,
//         q.userid,
//         q.title,
//         q.description,
//         q.tag,
//         q.created_at,
//         u.username
//       FROM questions q
//       JOIN users u ON q.userid = u.userid
//       ORDER BY q.created_at DESC
//     `);

//     res.json(rows);
//   } catch (error) {
//     console.error("❌ getAllQuestions error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ✅ GET single question (with username)
// export const getSingleQuestion = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const [rows] = await db.query(
//       `
//       SELECT
//         q.questionid,
//         q.userid,
//         q.title,
//         q.description,
//         q.tag,
//         q.created_at,
//         u.username
//       FROM questions q
//       JOIN users u ON q.userid = u.userid
//       WHERE q.questionid = ?
//       `,
//       [Number(id)]
//     );

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "Question not found" });
//     }

//     res.json(rows[0]);
//   } catch (error) {
//     console.error("❌ getSingleQuestion error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ✅ NEW: SEARCH questions (title/description/tag/username)
// // GET /api/questions/search?q=term
// export const searchQuestions = async (req, res) => {
//   try {
//     const q = (req.query.q || "").trim();
//     if (!q) return res.json([]);

//     const like = `%${q}%`;

//     const [rows] = await db.query(
//       `
//       SELECT
//         q.questionid,
//         q.userid,
//         q.title,
//         q.description,
//         q.tag,
//         q.created_at,
//         u.username
//       FROM questions q
//       JOIN users u ON q.userid = u.userid
//       WHERE
//         q.title LIKE ?
//         OR q.description LIKE ?
//         OR q.tag LIKE ?
//         OR u.username LIKE ?
//       ORDER BY q.created_at DESC
//       LIMIT 50
//       `,
//       [like, like, like, like]
//     );

//     res.json(rows);
//   } catch (error) {
//     console.error("❌ searchQuestions error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // ✅ POST question (protected)
// export const createQuestion = async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const userId = req.user?.userid;

//     if (!userId) return res.status(401).json({ message: "Unauthorized" });

//     if (!title || !description) {
//       return res
//         .status(400)
//         .json({ message: "title and description are required" });
//     }

//     // optional: if you also store tag/tags, handle it here
//     // const tag = req.body.tag ?? null;

//     await db.query(
//       "INSERT INTO questions (title, description, userid) VALUES (?, ?, ?)",
//       [title, description, userId]
//     );

//     res.status(201).json({ message: "Question created successfully" });
//   } catch (error) {
//     console.error("❌ createQuestion error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };
import db from "../db/dbConfig.js";

// ✅ GET all questions (with username + avatar)
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
        u.username,
        u.avatar_url
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

// ✅ GET single question (with username + avatar)
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
        u.username,
        u.avatar_url
      FROM questions q
      JOIN users u ON q.userid = u.userid
      WHERE q.questionid = ?
      `,
      [Number(id)],
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

// ✅ SEARCH questions (title/description/tag/username) + avatar
// GET /api/questions/search?q=term
export const searchQuestions = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);

    const like = `%${q}%`;

    const [rows] = await db.query(
      `
      SELECT 
        q.questionid,
        q.userid,
        q.title,
        q.description,
        q.tag,
        q.created_at,
        u.username,
        u.avatar_url
      FROM questions q
      JOIN users u ON q.userid = u.userid
      WHERE
        q.title LIKE ?
        OR q.description LIKE ?
        OR q.tag LIKE ?
        OR u.username LIKE ?
      ORDER BY q.created_at DESC
      LIMIT 50
      `,
      [like, like, like, like],
    );

    res.json(rows);
  } catch (error) {
    console.error("❌ searchQuestions error:", error);
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
      [title, description, userId],
    );

    res.status(201).json({ message: "Question created successfully" });
  } catch (error) {
    console.error("❌ createQuestion error:", error);
    res.status(500).json({ message: error.message });
  }
};




