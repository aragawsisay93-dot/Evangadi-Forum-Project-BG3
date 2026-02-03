

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

// ✅ needed for serving uploads folder in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(logger);

// ✅ serve uploaded files (avatar images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => res.send("Evangadi Forum API is running!"));

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

app.use("/api/user", userRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/answers", answersRoutes);

// ✅ profile routes (avatar upload)
app.use("/api/profile", profileRoute);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));
app.use(errorHandler);

setInterval(() => console.log("server alive..."), 30000);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
