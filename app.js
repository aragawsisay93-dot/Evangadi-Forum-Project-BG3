

// import "dotenv/config";

// import express from "express";
// import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";

// import logger from "./middleware/loggingMiddleware.js";
// import errorHandler from "./middleware/errorHandler.js";

// import userRoutes from "./routes/userRoute.js";
// import questionsRoutes from "./routes/questionsRoute.js";
// import answersRoutes from "./routes/answersRoute.js";
// import profileRoute from "./routes/profileRoute.js";

// import { testDBConnection } from "./db/dbConfig.js";

// const app = express();
// const PORT = process.env.PORT || 5500;

// // ✅ needed for serving uploads folder in ESM
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// app.use(cors({ origin: true, credentials: true }));
// app.use(express.json());
// app.use(logger);

// // ✅ serve uploaded files (avatar images)
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.get("/", (req, res) => res.send("Evangadi Forum API is running!"));

// // ✅ DB connectivity check
// app.get("/api/health/db", async (req, res, next) => {
//   try {
//     await testDBConnection();
//     res.json({ ok: true, message: "DB connected ✅" });
//   } catch (err) {
//     err.status = 500;
//     err.message = "DB connection failed ❌: " + (err?.message || String(err));
//     next(err);
//   }
// });

// app.use("/api/user", userRoutes);
// app.use("/api/questions", questionsRoutes);
// app.use("/api/answers", answersRoutes);

// // ✅ profile routes (avatar upload)
// app.use("/api/profile", profileRoute);

// app.use((req, res) => res.status(404).json({ message: "Route not found" }));
// app.use(errorHandler);

// setInterval(() => console.log("server alive..."), 30000);

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// app.js
import "dotenv/config";

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import logger from "./middleware/loggingMiddleware.js";
import errorHandler from "./middleware/errorHandler.js";

import userRoutes from "./routes/userRoute.js";
import questionsRoutes from "./routes/questionsRoute.js";
import answersRoutes from "./routes/answersRoute.js";
import profileRoute from "./routes/profileRoute.js";

import { testDBConnection } from "./db/dbConfig.js";

const app = express();
const PORT = process.env.PORT || 5500;

// ✅ Needed for serving static files in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================
// Middleware
// ============================

// ✅ allow any localhost Vite port 5170-5179 (so you don’t keep editing)
const viteLocalhostRegex = /^http:\/\/localhost:517\d$/;

// ✅ allow Cloudflare Pages (all branches / previews) if you want
const cloudflarePagesRegex = /^https:\/\/.*\.pages\.dev$/;

// ✅ CLIENT_URL can be 1 URL or multiple separated by comma
const envClientUrls = (process.env.CLIENT_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// ✅ CORS: allow Netlify + domain(s) + local dev + Cloudflare Pages
const allowedOrigins = [
  ...envClientUrls,

  // Netlify (your current one)
  "https://evangadiforumaragaw.netlify.app",

  // Cloudflare Pages (your deployed frontend)
  "https://evangadi-forum-bg3.pages.dev",

  // your domain(s)
  "https://agsisay.com",
  "https://www.agsisay.com",

  // local dev
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
].filter(Boolean);

const corsOptions = {
  origin: (origin, cb) => {
    // allow Postman/curl/no-origin requests
    if (!origin) return cb(null, true);

    // ✅ allow exact matches
    if (allowedOrigins.includes(origin)) return cb(null, true);

    // ✅ allow vite ports dynamically (5170-5179)
    if (viteLocalhostRegex.test(origin)) return cb(null, true);

    // ✅ allow Cloudflare Pages previews (optional, but useful)
    if (cloudflarePagesRegex.test(origin)) return cb(null, true);

    return cb(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// ✅ Handle preflight requests for ALL routes
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(logger);

// ✅ Serve uploaded files (avatar images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ============================
// Health / Info routes
// ============================
app.get("/", (req, res) => res.send("Evangadi Forum API is running!"));

// ✅ So visiting /api in browser won’t show “Route not found”
app.get("/api", (req, res) => {
  res.json({
    ok: true,
    message: "Evangadi Forum API base is running ✅",
    endpoints: {
      login: "POST /api/user/login (alias) OR POST /api/users/login",
      register: "POST /api/user/register (alias) OR POST /api/users/register",
      checkUser: "GET /api/user/checkUser (alias) OR GET /api/users/checkUser",
      questions: "GET /api/questions",
      answers: "GET /api/answers/:questionId",
      profile: "GET /api/profile",
      dbHealth: "GET /api/health/db",
    },
  });
});

// ✅ DB connectivity check
app.get("/api/health/db", async (req, res, next) => {
  try {
    await testDBConnection();
    res.json({ ok: true, message: "DB connected ✅" });
  } catch (err) {
    err.status = 500;
    err.message = "DB connection failed ❌: " + (err?.message || String(err));
    next(err);
  }
});

// ============================
// API Routes
// ============================

// ✅ Main routes
app.use("/api/users", userRoutes);

// ✅ Compatibility alias for your current frontend calls (/api/user/...)
app.use("/api/user", userRoutes);

app.use("/api/questions", questionsRoutes);
app.use("/api/answers", answersRoutes);
app.use("/api/profile", profileRoute);

// ============================
// 404 + Error handler
// ============================
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    method: req.method,
    path: req.originalUrl,
  });
});

app.use(errorHandler);

// ============================
// Start server
// ============================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Allowed origins:", allowedOrigins);
});

