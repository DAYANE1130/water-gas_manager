import geminiIntegrationService from './ geminiIntegrationService';
import uploadModel from '../models/measureImageUploadModel';
import { ServiceResponse } from '../interfaces/measureUploadServiceInterface';



const measureImageUploadService = {

  //Função que recebe a imagem base 64 da leitura e passa para Gemini fazer upload e devolver leitura
  async processImageUpload(image: string): Promise<ServiceResponse> {

    // Chama o serviço Gemini para processar a imagem
    const result = await geminiIntegrationService.generateContextGemini(image);

    if (!result || !result.image_url || !result.measure_value) {
      return {
        success: false, error: { error_code: "BAD_REQUEST", error_description: 'Erro ao fazer leitura' }
      }
    }

    return { success: true, data: result };


  },

  // Obtém as leituras do mês para o tipo de leitura e cliente
  async checkCurrentMonthMeasurements(customerCode: string, measureDatetime: string, measureType: string) {
 
    const readings = await uploadModel.getMonthlyReadings(customerCode, measureType, measureDatetime);

    // Verifica se já existe uma leitura no mês para o tipo de leitura e cliente
    if (readings.length > 0) {
      return { success: false, error: { error_code: 'DOUBLE_REPORT', error_description: 'Já existe uma leitura para este tipo no mês atual' } }
    }
    return { success: true }
  },

  // Cria uma nova leitura no banco de dados
  async createMeasure(image: string, customerCode: string, measureDatetime: string, measureType: string): Promise<ServiceResponse> {

    // verifica se já existe uma leitura para o mês atual
    const checkResult = await measureImageUploadService.checkCurrentMonthMeasurements(customerCode, measureDatetime, measureType);
    if (!checkResult.success) {
      return { success: false, error: checkResult.error };
    }
    // Verifica se upload e leitura do Gemini deu certo
    const uploadResult = await measureImageUploadService.processImageUpload(image);
   
    if (!uploadResult.success) {
      return { success: false, error: uploadResult.error };
    }

    //  Se deu tudo certo, agora sim persiste a leitura no banco de dados

    const resultModel = await uploadModel.saveReading( // salvei em uma const para conseguir pegar o uuid atraves retorno da model 
      customerCode,
      uploadResult.data.image_url,
      measureDatetime,
      measureType,
      uploadResult.data.measure_value
    );

    return { success: true, data: resultModel };
  },



  // Busca um cliente específíco por todos os tipos de leitura ou por um tipo especifico
  async getCustomerCode(customerId: string, measureType?: string): Promise<ServiceResponse> {

    //convertendo o tipo de leitura enviada para maiúsculo
    const typeMeasure = measureType?.toUpperCase();


    const measures = await uploadModel.getCustomer(customerId);
   
    //FALTA TIPAR PARA PEGAR O ERRO NO CONTROLLER
    if (measures.length === 0) {
      return {
        success: false,
        error: {
          error_code: 'MEASURES_NOT_FOUND',
          error_description: "Nenhuma leitura encontrada"
        }
      }
    }
    const measureByType = measures.filter((measure) => measure.measure_type === typeMeasure);

    if (typeMeasure) {
      return { success: true, data: measureByType };
    }

    return { success: true, data: { customer_code: customerId, measures } };
  }
};

export default measureImageUploadService;

