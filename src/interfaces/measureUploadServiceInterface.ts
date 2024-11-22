
interface Reading {
  id: number;
  customer_code: string;
  image_url: string;
  measure_uuid: string;
  measure_value: number;
  measure_type: string;
  confirmed: number;
  measure_datetime: string;
}
export interface ServiceResponse {
  success: boolean;
  data?: any | Reading;
  error?: { error_code: string; error_description: string };
}
