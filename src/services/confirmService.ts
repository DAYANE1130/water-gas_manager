import confirmMeasureModel from "../models/confirmModel";
import { ServiceResponse } from "../interfaces/measureUploadServiceInterface";
const confirmMeasureService = {

  // consultar no banco se aquela leitura existe
  async verifyIfMeasureExist(measure_uuid: string) {

    const result = await confirmMeasureModel.verifyIfMeasureExist(measure_uuid);

    if (!result) {
      return {
        sucess: false,
        error: {
          error_code: 'MEASURE_NOT_FOUND',
          error_description: 'Essa leitura não existe, leitura do mês já realizada'
        }

      }
    }
    return { sucess: true, result };

  },

  // Verificar se aquela leitura ja foi confirmada
  async verifyIfExistConfirmedMeasure(measure_uuid: string) {

    const measure = await this.verifyIfMeasureExist(measure_uuid);
  
    if (measure.result?.confirmed === 1) {
      return {
        sucess: false,
        error: {
          error_code: 'CONFIRMATION_DUPLICATE',
          error_description: 'Essa leitura já foi confirmada, leitura do mês já realizada'
        }

      }
    }
    return { sucess: true };
  },


  // Função responsável por confirmar ou corrigir o valor lido pelo LLMResponsável por confirmar ou corrigir o valor lido pelo LLM
  async updateMeasure(measure_uuid: string, confirmed_value: number): Promise<ServiceResponse> {


    const existMeasure = await this.verifyIfMeasureExist(measure_uuid);

    if (!existMeasure.sucess) {
      return { success: false, error: existMeasure.error }
    }

    const confirmedMeasure = await this.verifyIfExistConfirmedMeasure(measure_uuid);

    if (!confirmedMeasure.sucess) {
      return { success: false, error: confirmedMeasure.error }
    }

    // Cara toda gente acima retornou true, vc NÃO entrou nas condições acima por isso chegou até aqui
    // vc ganhou, foi aprovado e por isso vou deixar vocẽ atualizar essa leitura
    // vou passar o que me mandou pra model , espera um pouco....
    await confirmMeasureModel.updadeMeasure(measure_uuid, confirmed_value);

    return { success: true }
  }

}

export default confirmMeasureService;