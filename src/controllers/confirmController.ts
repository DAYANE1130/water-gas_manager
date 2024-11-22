import { Request, Response, NextFunction } from 'express';

import confirmMeasureService from '../services/confirmService';

const confirmMeasuresController = {

  async confirmMeasure(req: Request, res: Response, next: NextFunction) {

    const { measure_uuid, confirmed_value } = req.body;

    const result = await confirmMeasureService.updateMeasure(measure_uuid, confirmed_value)

    if (result.error?.error_code === 'MEASURE_NOT_FOUND') {
      return next({ status: 404, message: result.error });
    }

    if (result.error?.error_code === 'CONFIRMATION_DUPLICATE') {
      return next({ status: 409, message: result.error });
    }

    return res.status(200).json(result);

  }
}

export default confirmMeasuresController;