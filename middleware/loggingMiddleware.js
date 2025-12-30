// middleware/loggingMiddleware.js
function logger(req, res, next) {
  const now = new Date();
  console.log(`[${now.toISOString()}] ${req.method} ${req.originalUrl}`);
  next(); // pass control to next middleware
}

module.exports = logger;
