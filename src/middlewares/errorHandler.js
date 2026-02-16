// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // Handle specific error types
  if (err.message === 'User not found' || err.message === 'Meeting not found') {
    return res.status(404).json({
      success: false,
      message: err.message
    });
  }

  if (err.message === 'Time slot already booked') {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  if (err.message === 'Email already exists') {
    return res.status(409).json({
      success: false,
      message: err.message
    });
  }

  // Default to 500 Internal Server Error
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

export default errorHandler;