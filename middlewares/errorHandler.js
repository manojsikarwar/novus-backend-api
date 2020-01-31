
const { check, validationResult } = require('express-validator/check');

module.exports.requestValidator = (req, res, next) => {
    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};