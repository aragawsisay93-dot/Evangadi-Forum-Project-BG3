require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5500;

// Middleware
app.use(express.json());

// Import custom middleware
const logger = require("./middleware/loggingMiddleware");
const errorHandler = require("./middleware/errorHandler");

// Use logging middleware for all requests
app.use(logger);

// Routes
const userRoutes = require("./routes/userRoute");
const questionsRoutes = require("./routes/questionsRoute");
const answersRoutes = require("./routes/answersRoute");

app.use("/api/user", userRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/answers", answersRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Evangadi Forum API is running!");
});

// Catch-all route for unknown endpoints
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
