// controllers/profileController.js
import fs from "fs";
import path from "path";
import db from "../db/dbConfig.js"; // ✅ your mysql pool/connection

export const updateAvatar = async (req, res) => {
  try {
    const userid = req.user?.userid;

    if (!userid) {
      return res.status(401).json({ message: "Unauthorized: missing userid" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // ✅ URL to be used in frontend
    const avatar_url = `/uploads/avatars/${req.file.filename}`;

    // ✅ (optional but recommended) delete old avatar file to avoid junk
    const [oldRows] = await db.query(
      "SELECT avatar_url FROM users WHERE userid=?",
      [userid],
    );
    const oldUrl = oldRows?.[0]?.avatar_url;

    await db.query("UPDATE users SET avatar_url=? WHERE userid=?", [
      avatar_url,
      userid,
    ]);

    if (oldUrl && oldUrl.startsWith("/uploads/avatars/")) {
      const oldFilePath = path.join(process.cwd(), oldUrl.replace(/^\//, ""));
      fs.unlink(oldFilePath, () => {}); // ignore error
    }

    // ✅ return updated user (BEST for frontend)
    const [rows] = await db.query(
      "SELECT userid, username, email, avatar_url FROM users WHERE userid=?",
      [userid],
    );

    return res.json({ user: rows[0] });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Avatar upload failed" });
  }
};
