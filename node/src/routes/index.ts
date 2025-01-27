import express from 'express';
import ordersRouter from "./orders"

const router = express.Router();

router.use('/orders', ordersRouter);

export default router;