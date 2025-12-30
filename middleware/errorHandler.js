// middleware/errorHandler.js
function errorHandler(err, req, res, next) {
  console.error(err.stack); // log full stack trace
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
}

module.exports = errorHandler;
