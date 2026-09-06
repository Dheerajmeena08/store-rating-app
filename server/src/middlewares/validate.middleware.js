function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      return res.status(400).json({
        error: {
          field: firstIssue.path.join('.') || 'body',
          message: firstIssue.message,
        },
      });
    }
    req.validatedBody = result.data;
    next();
  };
}

module.exports = validate;
