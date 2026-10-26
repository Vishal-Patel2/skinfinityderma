/** Typed HTTP error that the error middleware turns into a JSON response. */
class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  let message = err.message || 'Internal server error';

  // Friendly messages for common MySQL errors
  switch (err.code) {
    case 'ER_DUP_ENTRY': {
      status = 409;
      const m = /for key '(?:[^.']+\.)?([^']+)'/.exec(err.message || '');
      message = `A record with the same value already exists${m ? ` (${m[1].replace(/^uq_|^idx_/, '')})` : ''}.`;
      break;
    }
    case 'ER_ROW_IS_REFERENCED_2':
      status = 409;
      message = 'This record is in use by other records and cannot be deleted.';
      break;
    case 'ER_NO_REFERENCED_ROW_2':
      status = 422;
      message = 'A referenced record does not exist.';
      break;
    case 'ER_DATA_TOO_LONG':
      status = 422;
      message = 'One of the values is too long.';
      break;
    case 'ER_TRUNCATED_WRONG_VALUE':
    case 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD':
    case 'ER_WARN_DATA_OUT_OF_RANGE':
      status = 422;
      message = 'One of the values is invalid.';
      break;
    default:
  }
  if (err.type === 'entity.parse.failed') {
    status = 400;
    message = 'Invalid JSON body';
  }
  if (err.code === 'LIMIT_FILE_SIZE') {
    status = 413;
    message = 'File is too large (max 8 MB).';
  }

  if (status >= 500) {
    console.error(`[error] ${req.method} ${req.originalUrl}`, err);
    if (process.env.NODE_ENV === 'production') message = 'Internal server error';
  }
  res.status(status).json({ success: false, message, ...(err.details ? { details: err.details } : {}) });
}

module.exports = { HttpError, asyncHandler, notFound, errorHandler };
