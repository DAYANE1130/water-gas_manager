import { Router } from 'express';
import uploadController from '../controllers/measureImageUploadController';
import validateInput from '../middlewares/uploadValidation';
import validateTypeMeasure from '../middlewares/customerCodeListValidation';


const route = Router();

route.post('/upload', validateInput, uploadController.measureUploadImage);
route.get('/customer/:customerCode/list',validateTypeMeasure, uploadController.getCustomerCode);

export default route;
