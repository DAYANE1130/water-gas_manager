import { Request, Response, NextFunction } from 'express';
import measureImageUploadService from '../services/measureImageUploadService';

const measureImageUploadController = {

  //Função que recebe a imagem base 64 e retorna a medida lida pela API do Gemini
  async measureUploadImage(req: Request, res: Response, next: NextFunction) {
    const { image, customerCode, measureDatetime, measureType } = req.body;

    const result = await measureImageUploadService.createMeasure(image, customerCode, measureDatetime, measureType);
    
    if (result.error?.error_code === 'DOUBLE_REPORT') {
      return next({ status: 409, message: result.error })
    }
    return res.status(200).json(result.data);

  },



  async getCustomerCode(req: Request, res: Response, next: NextFunction) {
    const { customerCode } = req.params;

    let measureType: string | undefined;

    if (typeof req.query.measure_type === 'string') {
      measureType = req.query.measure_type;
    }

    const measures = await measureImageUploadService.getCustomerCode(customerCode, measureType);

    if (measures.error?.error_code === 'MEASURES_NOT_FOUND') {
      return next({ status: 404, message: measures.error })
    }

    return res.status(200).json(measures.data);

  }
};

export default measureImageUploadController;