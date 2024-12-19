
// Interfaces para os casos de sucesso
export type MeasureType = 'WATER' | 'GAS' | '';

export interface IReadingUpload {
  image: File | string | Blob,
  customerCode: string,
  measureDatetime: string,
  measureType: MeasureType,
}



export interface IResponseApiSuccessReadingUpload {
  imageUrl: string,
  measureValue: number,
  measureUuid: string
}

// Interfaces para os casos de erro
export interface IResponseApiError {
  error_code: string,
  error_description: string,
}

// Interface geral de resposta da api, pode vir sucesso ou um erro
export interface IResponseApi {
  data?: IResponseApiSuccessReadingUpload,
  erro?: IResponseApiError,
}