import { Request, Response, NextFunction } from 'express';
import schema from '../validators/customerListValidator'; 


const validateTypeMeasure = (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.query, { abortEarly: false }); // VALIDATE espera receber um objeto
  if (error) {
    return res.status(400).json({
      error_code: 'INVALID_TYPE',
      error_description: 'Tipo de medição não permitida'
    });
  }

  next();

}

export default validateTypeMeasure;