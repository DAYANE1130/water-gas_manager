import { Request, Response, NextFunction, } from 'express';
import 'express-async-errors';
import { CustomError } from '../interfaces/errorHandlerInterface';


const errorHandler = (err:CustomError, _req:Request, res:Response, _next:NextFunction) => {
  const status = err.status || 500;
  const message = err.message || 'Erro inesperado, tente mais tarde';
 return res.status(status).json(message );
};
export default  errorHandler ;

