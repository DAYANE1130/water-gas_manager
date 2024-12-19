
// Interfaces para os casos de sucesso
export interface IReadings {
  measure_uuid: string,
  measure_datetime: string,
  measure_type: 'WATER'|'GAS',
  has_confirmed:boolean,
  image_url: string
  }

export interface IResponseApiSuccessListReadings{
customer_code: string,
measures : IReadings[]
}  

// Interfaces para os casos de erro
export interface IResponseApiError{
  error_code: string,
  error_description: string,
  }  

  // Interface geral de resposta da api, pode vir sucesso ou um erro
  export interface IResponseApi {
    data?:IResponseApiSuccessListReadings,
    erro?: IResponseApiError, 
  }