import { Invoice } from '../../models/Invoice';
import { initiateOrder } from '../../services/orders';
import { Request, Response } from 'express';
import { InventoryItem } from '../../models/InventoryItem';
import { Customer } from '../../models/Customer';

export async function handleOrderInitiate(
    req: Request<{}, {}, { itemIds: InventoryItem['id'][], customerId: Customer['id'] }>,
    res: Response<{ orderId: number, invoice: Invoice }>
): Promise<void> {
    const { itemIds, customerId } = req.body;
    const { order, invoice } = await initiateOrder(customerId, itemIds)
    res.send({ invoice, orderId: order.id })
}
