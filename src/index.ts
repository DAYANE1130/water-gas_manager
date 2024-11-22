import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const port = process.env.PORT || 3000; // não tem variAvel PORT


const server = app.listen(port, () => console.log(
  `Server is running on PORT: ${port}`,
));

export default server;
