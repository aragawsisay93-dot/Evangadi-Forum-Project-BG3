// // middleware/authMiddleware.js
// import jwt from "jsonwebtoken";

// export default function auth(req, res, next) {
//   const authHeader = req.headers.authorization; // "Bearer <token>"
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "Access denied. No token provided." });
//   }

//   try {
//     if (!process.env.JWT_SECRET) {
//       return res.status(500).json({ message: "JWT_SECRET is not set in .env" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // { userid, email, username, iat, exp }
//     next();
//   } catch (err) {
//     return res.status(403).json({ message: "Invalid token" });
//   }
// }


// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const authHeader = req.headers.authorization || ""; // "Bearer <token>"
  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "JWT_SECRET is not set in .env" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userid, email, username, iat, exp }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}
