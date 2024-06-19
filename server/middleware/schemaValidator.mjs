import { validationResult } from "express-validator";

export const validate = (schema) => {
  return async (req, res, next) => {
    await Promise.all(schema.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};
