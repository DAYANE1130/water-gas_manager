import { Request, Response, NextFunction } from 'express';
import schema from '../validators/uploadValidator'; 

const validateInput = (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const error_description = error.details.map(detail => detail.message);
    return next({ status: 400, message: error_description });
  }

  next();
};

export default validateInput;