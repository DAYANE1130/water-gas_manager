import { Request, Response, NextFunction } from 'express';
import schema from '../validators/confirmValidator';

const validateInput = (req: Request, res: Response, next: NextFunction) => {
 
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const error_description = error.details.map(detail => detail.message);
    return res.status(400).json({ "error_code": "INVALID_DATA", error_description });
  }

  next();
};

export default validateInput;