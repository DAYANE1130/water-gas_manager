
import Joi, { ObjectSchema } from 'joi';

const schema: ObjectSchema = Joi.object({
  image: Joi.string().base64().required().messages({
    'string.pattern.base': 'Imagem inválida',
    'any.required': 'Imagem é obrigatória'
  }),
  customerCode: Joi.string().required().messages({
    'string.base': 'Código do cliente deve ser uma string',
    'any.required': 'Código do cliente é obrigatório'
  }),
  measureDatetime: Joi.date().iso().required().messages({
    'date.base': 'Data/hora da medição deve ser uma data válida',
    'date.format': 'Data/hora da medição deve estar no formato ISO',
    'any.required': 'Data/hora da medição é obrigatória'
  }),
  measureType: Joi.string().valid('WATER', 'GAS').required().messages({
    'string.base': 'Tipo de medição deve ser uma string',
    'any.only': 'Tipo de medição deve ser "WATER" ou "GAS"',
    'any.required': 'Tipo de medição é obrigatório'
  }),
});

export default schema;