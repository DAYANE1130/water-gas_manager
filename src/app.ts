import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { uploadRouter } from './routes/index';
import { confirmRouter } from './routes/index';
import errorMiddleware from './middlewares/error';
import cors from 'cors';
import corsConfig from './corsConfig';

const app = express();

app.use(express.json());

app.use(cors(corsConfig))

app.get('/', (_req, res) => {
  res.status(StatusCodes.OK).send('Express + TypeScript');
});

app.use('/', uploadRouter);
app.use('/', confirmRouter);
app.use(errorMiddleware)

export default app;
