import dbConnection from './connection';
import { QueryResult, RowDataPacket } from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';


interface Reading extends RowDataPacket {
  id: number;
  customer_code: string;
  image_url: string;
  measure_uuid: string;
  measure_value: number;
  measure_type: string;
  measure_datetime: string;
}

const readingModel = {
  async getMonthlyReadings(customerCode: string, measureType: string, measureDateTime: string): Promise<Reading[]> {
    const [rows] = await dbConnection.execute<Reading[]>(
      'SELECT * FROM readings WHERE customer_code = ? AND measure_type = ? AND DATE_FORMAT(measure_datetime, "%Y-%m") = DATE_FORMAT(?, "%Y-%m")',
      [customerCode, measureType, measureDateTime]
    );
    return rows;
  },

  async saveReading(customerCode: string, imageUrl: string, measureDateTime: string, measureType: string, measureValue: number) {
    const measureUuid = uuidv4();

    await dbConnection.execute<QueryResult>(
      'INSERT INTO readings (image_url, customer_code, measure_value, measure_datetime, measure_type, measure_uuid) VALUES (?, ?, ?, ?, ?, ?)',
      [imageUrl, customerCode, measureValue, measureDateTime, measureType, measureUuid]
    );

    return { imageUrl, measureValue, measureUuid };
  },

  async getCustomer(customerId: string) {
    const query = 'SELECT * FROM readings WHERE customer_code=?';
    const [measures] = await dbConnection.execute<Reading[]>(query, [customerId]);
    return measures;
  }
};

export default readingModel;