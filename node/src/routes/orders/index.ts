import express from 'express';
import { handleOrderConfirm } from './handleOrderConfirm';
import { handleOrderInitiate } from './handleOrderInitiate';
import expressAsyncHandler from 'express-async-handler';

const router = express.Router();

router.post('/initiate', expressAsyncHandler(handleOrderInitiate));

router.post('/confirm', expressAsyncHandler(handleOrderConfirm));

export default router;