import { Invoice } from '@src/models/Invoice';
import { initiateOrder } from '@src/services/orders';
import { Request, Response } from 'express';
import { InventoryItem } from '@src/models/InventoryItem';
import { Customer } from '@src/models/Customer';

export async function handleOrderInitiate(
    req: Request<{}, {}, { itemIds: InventoryItem['id'][], customerId: Customer['id'] }>,
    res: Response<{ orderId: number, invoice: Invoice }>
): Promise<void> {
    const { itemIds, customerId } = req.body;
    const { order, invoice } = await initiateOrder(customerId, itemIds)
    res.send({ invoice, orderId: order.id })
}
