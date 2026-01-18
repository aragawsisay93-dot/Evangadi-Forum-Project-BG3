// // middleware/loggingMiddleware.js
// function logger(req, res, next) {
//   const now = new Date();
//   console.log(`[${now.toISOString()}] ${req.method} ${req.originalUrl}`);
//   next();
// }

// module.exports = logger;
// middleware/loggingMiddleware.js
export default function logger(req, res, next) {
  const now = new Date();
  console.log(`[${now.toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
}
