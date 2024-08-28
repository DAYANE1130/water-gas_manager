import express from 'express';
import { StatusCodes } from 'http-status-codes';

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.status(StatusCodes.OK).send('Express + TypeScript');
});

//app.use('/accounts', router.accountRouter);

export default app;
