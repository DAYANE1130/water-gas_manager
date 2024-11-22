import dbConnection from './connection';
import { QueryResult, RowDataPacket } from 'mysql2/promise';



interface Reading extends RowDataPacket {
  id: number;
  customer_code: string;
  image_url: string;
  measure_uuid: string;
  measure_value: number;
  measure_type: string;
  confirmed: number;
  measure_datetime: string;
}
const confirmMeasureModel = {

  // consultar no banco de aquela leitura existe e vai servir para as duas validações
  async verifyIfMeasureExist(measure_uuid: string,) {

    const query = 'SELECT * FROM readings WHERE  measure_uuid=?';
    const [[measure]] = await dbConnection.execute<Reading[]>(query, [measure_uuid]);
    // o retorno e um array de objetos usando [[]] acesso primeiro objeto do array
    return measure;

  },


  // Função responsável por atualizar a leitura
  // async updadeMeasure(measure_uuid: string, confirmed_value: number) {

  //   const query = 'UPDATE  readings SET measure_value=?, confirmed=? WHERE  measure_uuid=?';
  //   const [measure] = await dbConnection.execute(query, [confirmed_value, true, measure_uuid]);
  //   return measure;
  // }
  // Função responsável por atualizar a leitura
  async updadeMeasure(measure_uuid: string, confirmed_value: number) {

    const query = 'UPDATE  readings SET measure_value=? WHERE  measure_uuid=?';
    const [measure] = await dbConnection.execute(query, [confirmed_value, measure_uuid]);
    return measure;
  }

}

export default confirmMeasureModel;