import { confirmOrder } from '@src/services/orders';
import { Request, Response } from 'express';

export async function handleOrderConfirm(
    req: Request<{}, {}, { orderId: number }>,
    res: Response<{ success: boolean }>
): Promise<void> {
    const { orderId } = req.body;
    const success = await confirmOrder(orderId);
    res.sendStatus(success ? 201 : 400)
}
