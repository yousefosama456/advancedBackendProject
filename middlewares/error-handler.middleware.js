module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  if (process.env.NODE_ENV === "development") {
    res.status(error.statusCode).json({
      status: error.status,
      error: error,
      message: error.message,
      stack: error.stack,
    });
  }
  if (process.env.NODE_ENV === "production") {
    if (error.isOperational) {
      return res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    }
    else{
        console.log('Unexpected Error || ', error)
          return res.status(error.statusCode).json({
        status: error.status,
        message: 'Something whent wrong',
      });
    }
  }
}
