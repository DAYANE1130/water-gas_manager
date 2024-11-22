
import Joi, { ObjectSchema } from 'joi';

const schema: ObjectSchema = Joi.object({

  measure_uuid: Joi.string().strict().required().messages({
    'string': 'Código da leitura deve ser uma string',
    'any.required': 'Código da leitura é obrigatório'
  }),
  confirmed_value : Joi.number().strict().required().messages({
    'number': 'A confirmação da leitura deve ser um número',
    'any.required': 'A confirmação da leitura é obrigatória'
  }),


});

export default schema;