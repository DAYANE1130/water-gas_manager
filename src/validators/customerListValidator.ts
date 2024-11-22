
import Joi, { ObjectSchema } from 'joi';

const schema: ObjectSchema = Joi.object({
  measure_type: Joi.string().valid('WATER', 'GAS').insensitive().optional()
    
  });

export default schema;