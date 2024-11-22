
// Interfaces para os casos de sucesso
export interface Readings {
  measure_uuid: string,
  measure_datetime: string,
  measure_type: 'WATER'|'GAS',
  has_confirmed:boolean,
  image_url: string
  }

export interface ResponseApiSuccessListReadings{
customer_code: string,
measures : Readings[]
}  

// Interfaces para os casos de erro
export interface ResponseApiError{
  error_code: string,
  error_description: string,
  }  

  // Interface geral de resposta da api, pode vir sucesso ou um erro
  export interface ResponseApi {
    data?:ResponseApiSuccessListReadings,
    erro?: ResponseApiError, 
  }