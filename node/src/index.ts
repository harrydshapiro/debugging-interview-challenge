import dotenv from 'dotenv';
dotenv.config()

import express from 'express';
import bodyParser from 'body-parser';
import router from "./routes";
import { initializeDb } from './db/init';
import { Request, Response, NextFunction } from 'express';

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/api', router);

// Default error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.sendStatus(500);
});

(async function () {
  await initializeDb();
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
})();
