const { ZodError } = require('zod');
const { ValidationError, UniqueConstraintError } = require('sequelize');


function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    const issue = err.issues[0];
    return res.status(400).json({
      error: { field: issue.path.join('.') || 'body', message: issue.message },
    });
  }

  if (err instanceof UniqueConstraintError) {
    return res.status(409).json({
      error: { field: err.errors?.[0]?.path || 'unique', message: 'This value already exists' },
    });
  }

  if (err instanceof ValidationError) {
    const first = err.errors[0];
    return res.status(400).json({
      error: { field: first.path, message: first.message },
    });
  }

  console.error(err);
  return res.status(err.status || 500).json({
    error: { field: 'server', message: err.message || 'Internal server error' },
  });
}

module.exports = errorHandler;
