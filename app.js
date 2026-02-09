// // app.js (FULL UPDATED — keep this as your backend entry file)
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

// // ✅ Needed for serving static files in ESM
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ============================
// // CORS / Middleware
// // ============================

// // ✅ allow any localhost Vite port 5170-5179
// const viteLocalhostRegex = /^http:\/\/localhost:517\d$/;

// // ✅ allow Cloudflare Pages (all branches / previews)
// const cloudflarePagesRegex = /^https:\/\/.*\.pages\.dev$/;

// // ✅ allow Netlify previews + all netlify subdomains
// //    (includes deploy previews + your main site)
// const netlifyRegex = /^https:\/\/.*\.netlify\.app$/;

// // ✅ CLIENT_URL can be 1 URL or multiple separated by comma
// // Example in Railway:
// // CLIENT_URL=https://your-site.netlify.app,http://localhost:5173
// const envClientUrls = (process.env.CLIENT_URL || "")
//   .split(",")
//   .map((s) => s.trim())
//   .filter(Boolean);

// // ✅ CORS allowed origins:
// // - Prefer environment variable CLIENT_URL (Railway)
// // - Plus optional known domains (your portfolio, etc.)
// // - Local dev
// const allowedOrigins = [
//   ...envClientUrls,

//   // your domain(s) (optional)
//   "https://agsisay.com",
//   "https://www.agsisay.com",

//   // local dev (optional)
//   "http://localhost:3000",
//   "http://localhost:5173",
//   "http://localhost:5174",
//   "http://localhost:5175",
// ].filter(Boolean);

// const corsOptions = {
//   origin: (origin, cb) => {
//     // allow Postman/curl/no-origin requests
//     if (!origin) return cb(null, true);

//     // ✅ allow exact matches
//     if (allowedOrigins.includes(origin)) return cb(null, true);

//     // ✅ allow vite ports dynamically (5170-5179)
//     if (viteLocalhostRegex.test(origin)) return cb(null, true);

//     // ✅ allow Cloudflare Pages previews
//     if (cloudflarePagesRegex.test(origin)) return cb(null, true);

//     // ✅ allow any Netlify site/previews
//     if (netlifyRegex.test(origin)) return cb(null, true);

//     return cb(null, false);
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   optionsSuccessStatus: 204,
// };

// app.use(cors(corsOptions));

// // ✅ Handle preflight requests for ALL routes
// app.options(/.*/, cors(corsOptions));

// app.use(express.json());
// app.use(logger);

// // ✅ Serve uploaded files (avatar images)
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // ============================
// // Health / Info routes
// // ============================
// app.get("/", (req, res) => res.send("Evangadi Forum API is running!"));

// // ✅ So visiting /api in browser won’t show “Route not found”
// app.get("/api", (req, res) => {
//   res.json({
//     ok: true,
//     message: "Evangadi Forum API base is running ✅",
//     endpoints: {
//       login: "POST /api/user/login (alias) OR POST /api/users/login",
//       register: "POST /api/user/register (alias) OR POST /api/users/register",
//       checkUser: "GET /api/user/checkUser (alias) OR GET /api/users/checkUser",
//       questions: "GET /api/questions",
//       answers: "GET /api/answers/:questionId",
//       profile: "GET /api/profile",
//       dbHealth: "GET /api/health/db",
//     },
//   });
// });

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

// // ============================
// // API Routes
// // ============================

// // ✅ Main routes
// app.use("/api/users", userRoutes);

// // ✅ Compatibility alias for your current frontend calls (/api/user/...)
// app.use("/api/user", userRoutes);

// app.use("/api/questions", questionsRoutes);
// app.use("/api/answers", answersRoutes);
// app.use("/api/profile", profileRoute);

// // ============================
// // 404 + Error handler
// // ============================
// app.use((req, res) => {
//   res.status(404).json({
//     message: "Route not found",
//     method: req.method,
//     path: req.originalUrl,
//   });
// });

// app.use(errorHandler);

// // ============================
// // Start server
// // ============================
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
//   console.log("CLIENT_URL:", process.env.CLIENT_URL || "(not set)");
//   console.log("Allowed origins:", allowedOrigins);
// });
// app.js (FULL UPDATED — backend entry file)
// app.js (FULL UPDATED — backend entry file)
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
// CORS / Middleware
// ============================

// ✅ allow any localhost Vite port 5170-5179
const viteLocalhostRegex = /^http:\/\/localhost:517\d$/;

// ✅ allow Cloudflare Pages (all branches / previews)
const cloudflarePagesRegex = /^https:\/\/.*\.pages\.dev$/;

// ✅ allow Netlify previews + all netlify subdomains
const netlifyRegex = /^https:\/\/.*\.netlify\.app$/;

// ✅ CLIENT_URL can be 1 URL or multiple separated by comma
const envClientUrls = (process.env.CLIENT_URL || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const allowedOrigins = [
  ...envClientUrls,

  // your domain(s) (optional)
  "https://agsisay.com",
  "https://www.agsisay.com",

  // local dev (optional)
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

    // ✅ allow Cloudflare Pages previews
    if (cloudflarePagesRegex.test(origin)) return cb(null, true);

    // ✅ allow any Netlify site/previews
    if (netlifyRegex.test(origin)) return cb(null, true);

    return cb(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(logger);

// ✅ Serve uploaded files (avatar images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ============================
// Health / Info routes
// ============================
app.get("/", (req, res) => res.send("Evangadi Forum API is running!"));

// ✅ Version endpoint (proves Railway deployed your latest code)
app.get("/api/health/version", (req, res) => {
  res.json({
    ok: true,
    commit: process.env.RAILWAY_GIT_COMMIT_SHA || "no-sha",
    time: new Date().toISOString(),
  });
});

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
      version: "GET /api/health/version",
    },
  });
});

// ✅ DB connectivity check (returns real root error)
app.get("/api/health/db", async (req, res) => {
  try {
    await testDBConnection();
    res.json({ ok: true, message: "DB connected ✅" });
  } catch (err) {
    console.error("❌ DB connection failed (raw):", err);

    if (err?.errors) {
      console.error("❌ AggregateError details:");
      err.errors.forEach((e, i) => {
        console.error(
          `  [${i}] name=${e?.name} code=${e?.code} message=${e?.message}`
        );
      });
    }

    res.status(500).json({
      ok: false,
      name: err?.name,
      code: err?.code,
      message: err?.message,
      inner: err?.errors?.map((e) => ({
        name: e?.name,
        code: e?.code,
        message: e?.message,
      })),
    });
  }
});

// ============================
// API Routes
// ============================

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
// Start server (keep-alive + debug)
// ============================
const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log("CLIENT_URL:", process.env.CLIENT_URL || "(not set)");
  console.log("Allowed origins:", allowedOrigins);
});

server.on("error", (err) => {
  console.error("❌ SERVER LISTEN ERROR:", err);
});

process.on("exit", (code) => {
  console.log("⚠️ Process exiting with code:", code);
});
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught exception:", err);
});
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled rejection:", err);
});
