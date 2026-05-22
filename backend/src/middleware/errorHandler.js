const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  if (err.type === 'validation') {
    return res.status(422).json({
      success: false,
      message: err.message
    });
  }

  if (err.type === 'not_found') {
    return res.status(404).json({
      success: false,
      message: err.message
    });
  }

  if (err.type === 'insufficient_balance') {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Something went wrong on the server'
  });
};

const createError = (type, message) => {
  const err = new Error(message);
  err.type = type;
  return err;
};

module.exports = { errorHandler, createError };