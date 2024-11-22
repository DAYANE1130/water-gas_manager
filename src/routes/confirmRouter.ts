import { Router } from "express";
import confirmMeasuresController from '../controllers/confirmController';
import validateInput from '../middlewares/confirmValidation';


const route = Router();

route.patch('/confirm',validateInput, confirmMeasuresController.confirmMeasure);
//route.post('/upload', validateInput, uploadController.measureUploadImage);

export default route;