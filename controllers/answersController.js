import db from "../db/dbConfig.js";

// =============================
// GET answers for a question (with username + counts)
// GET /api/answers/:questionId
// =============================
export const getAnswersByQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        a.answerid,
        a.answer,
        a.questionid,
        a.userid,
        a.created_at,
        u.username,

        -- counts
        COALESCE(l.likeCount, 0) AS likeCount,
        COALESCE(d.dislikeCount, 0) AS dislikeCount,
        COALESCE(c.commentCount, 0) AS commentCount

      FROM answers a
      JOIN users u ON a.userid = u.userid

      LEFT JOIN (
        SELECT answerid, COUNT(*) AS likeCount
        FROM answer_reactions
        WHERE type='like'
        GROUP BY answerid
      ) l ON l.answerid = a.answerid

      LEFT JOIN (
        SELECT answerid, COUNT(*) AS dislikeCount
        FROM answer_reactions
        WHERE type='dislike'
        GROUP BY answerid
      ) d ON d.answerid = a.answerid

      LEFT JOIN (
        SELECT answerid, COUNT(*) AS commentCount
        FROM answer_comments
        GROUP BY answerid
      ) c ON c.answerid = a.answerid

      WHERE a.questionid = ?
      ORDER BY a.created_at DESC
      `,
      [Number(questionId)]
    );

    res.json(rows);
  } catch (error) {
    console.error("❌ getAnswersByQuestion error:", error);
    res.status(500).json({ message: error.message });
  }
};

// =============================
// POST answer (protected)
// POST /api/answers/:questionId
// =============================
export const createAnswer = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { answer } = req.body;

    const userId = req.user?.userid;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!answer?.trim())
      return res.status(400).json({ message: "answer is required" });

    await db.query(
      "INSERT INTO answers (answer, questionid, userid) VALUES (?, ?, ?)",
      [answer.trim(), Number(questionId), userId]
    );

    res.status(201).json({ message: "Answer posted successfully" });
  } catch (error) {
    console.error("❌ createAnswer error:", error);
    res.status(500).json({ message: error.message });
  }
};

// =============================
// PUT edit answer (protected, owner only)
// PUT /api/answers/edit/:answerId   (OR /api/answers/:answerId)
// =============================
export const updateAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const { answer } = req.body;

    const userId = req.user?.userid;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!answer?.trim())
      return res.status(400).json({ message: "answer is required" });

    // check owner
    const [rows] = await db.query(
      "SELECT userid FROM answers WHERE answerid = ? LIMIT 1",
      [Number(answerId)]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (Number(rows[0].userid) !== Number(userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await db.query("UPDATE answers SET answer = ? WHERE answerid = ?", [
      answer.trim(),
      Number(answerId),
    ]);

    res.json({ message: "Answer updated successfully" });
  } catch (error) {
    console.error("❌ updateAnswer error:", error);
    res.status(500).json({ message: error.message });
  }
};

// =============================
// DELETE answer (protected, owner only)
// DELETE /api/answers/:answerId
// =============================
export const deleteAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const userId = req.user?.userid;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const [rows] = await db.query(
      "SELECT userid FROM answers WHERE answerid = ? LIMIT 1",
      [Number(answerId)]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (Number(rows[0].userid) !== Number(userId)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await db.query("DELETE FROM answers WHERE answerid = ?", [
      Number(answerId),
    ]);

    res.json({ message: "Answer deleted successfully" });
  } catch (error) {
    console.error("❌ deleteAnswer error:", error);
    res.status(500).json({ message: error.message });
  }
};

// =============================
// React (like/dislike) toggle
// POST /api/answers/:answerId/react
// body: { type: "like" | "dislike" }
// Rules:
// - if user clicks same type again -> remove reaction
// - if user clicks other type -> switch reaction
// =============================
export const reactToAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const { type } = req.body;

    const userId = req.user?.userid;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (type !== "like" && type !== "dislike") {
      return res.status(400).json({ message: "type must be like or dislike" });
    }

    // does user already have a reaction?
    const [existing] = await db.query(
      "SELECT id, type FROM answer_reactions WHERE answerid = ? AND userid = ? LIMIT 1",
      [Number(answerId), Number(userId)]
    );

    if (existing.length === 0) {
      // add new
      await db.query(
        "INSERT INTO answer_reactions (answerid, userid, type) VALUES (?, ?, ?)",
        [Number(answerId), Number(userId), type]
      );
      return res.json({ message: "Reaction added" });
    }

    // if same type => remove
    if (existing[0].type === type) {
      await db.query("DELETE FROM answer_reactions WHERE id = ?", [
        existing[0].id,
      ]);
      return res.json({ message: "Reaction removed" });
    }

    // else switch
    await db.query("UPDATE answer_reactions SET type = ? WHERE id = ?", [
      type,
      existing[0].id,
    ]);

    return res.json({ message: "Reaction updated" });
  } catch (error) {
    console.error("❌ reactToAnswer error:", error);
    res.status(500).json({ message: error.message });
  }
};

// =============================
// GET comments for answer
// GET /api/answers/:answerId/comments
// =============================
export const getCommentsByAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;

    const [rows] = await db.query(
      `
      SELECT
        c.commentid,
        c.answerid,
        c.userid,
        c.comment,
        c.created_at,
        u.username
      FROM answer_comments c
      JOIN users u ON u.userid = c.userid
      WHERE c.answerid = ?
      ORDER BY c.created_at ASC
      `,
      [Number(answerId)]
    );

    res.json(rows);
  } catch (error) {
    console.error("❌ getCommentsByAnswer error:", error);
    res.status(500).json({ message: error.message });
  }
};

// =============================
// POST comment (protected)
// POST /api/answers/:answerId/comments
// body: { comment: "..." }
// =============================
export const createComment = async (req, res) => {
  try {
    const { answerId } = req.params;
    const { comment } = req.body;

    const userId = req.user?.userid;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!comment?.trim()) {
      return res.status(400).json({ message: "comment is required" });
    }

    await db.query(
      "INSERT INTO answer_comments (answerid, userid, comment) VALUES (?, ?, ?)",
      [Number(answerId), Number(userId), comment.trim()]
    );

    res.status(201).json({ message: "Comment added" });
  } catch (error) {
    console.error("❌ createComment error:", error);
    res.status(500).json({ message: error.message });
  }
};
