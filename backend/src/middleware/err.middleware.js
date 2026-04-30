export const errorHandler = (err, req, res, next) => {
  console.error(err); 

  // Check if headers already sent to avoid "ERR_HTTP_HEADERS_SENT"
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};