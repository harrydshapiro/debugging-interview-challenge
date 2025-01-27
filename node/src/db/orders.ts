import { DBOrder, OrderStatus } from "../models/Order";
import { getDb } from "./init";
import { DBOrderItem } from "../models/OrderItem";
import { DBInventoryItem } from "../models/InventoryItem";
import { DBPromotion } from "../models/Promotion";
import { getNow } from "@src/utils/time";

export async function createDBOrder ({ created_at, customer_id }: Omit<DBOrder, 'id'>): Promise<DBOrder> {
    const db = await getDb();
    const [dbOrder] = await db.all<DBOrder>(`INSERT INTO orders (customer_id, created_at) VALUES (${customer_id}, ${created_at}) RETURNING *`)
    return dbOrder
}
export async function createDBOrderItems(orderItems: Omit<DBOrderItem, 'id'>[]): Promise<DBOrderItem[]> {
    const db = await getDb();
    const values = orderItems.map(({ order_id, item_id }) => `(${order_id}, ${item_id})`).join(", ");
    const query = `INSERT INTO order_items (order_id, item_id) VALUES ${values} RETURNING *`;
    const dbOrderItems = await db.all<DBOrderItem>(query);
    return dbOrderItems;
}

export async function getDBOrderById(orderId: number): Promise<DBOrder | null> {
    const db = await getDb();
    const [dbOrder] = await db.all<DBOrder>(`SELECT * FROM orders WHERE id = ${orderId}`);
    return dbOrder || null;
}

export async function getAllInventoryItemsInOrder (orderId: number): Promise<DBInventoryItem[]> {
    const db = await getDb()
    const dbInventoryItems = await db.all<DBInventoryItem>(`SELECT inventory_items.* FROM inventory_items INNER JOIN order_items ON inventory_items.id = order_items.item_id WHERE order_items.order_id = '${orderId}'`)
    return dbInventoryItems
}

/**
 * Fetches the currently active promotion. "Active" means it has already started, 
 * hasn't ended, and hasn't hit its max qualifying orders. If there are multiple
 * promotions active, the one with the smallest discount % is preferred.
 */
export async function getActivePromotion (): Promise<DBPromotion | null> {
    const db = await getDb();

    const [activePromotion] = await db.all<DBPromotion>(`SELECT * FROM promotions WHERE starts_at < ${getNow()} AND ends_at > ${getNow()} ORDER BY percentage_off ASC LIMIT 1`)

    if (!activePromotion) {
        return null
    }

    const [ordersDuringActivePromotion] = await db.all<number>(`
        SELECT COUNT(id) 
        FROM orders
        WHERE 
            status = 'completed'
            AND created_at > ${activePromotion.starts_at}
            AND created_at < ${activePromotion.ends_at}
    `)

    if (ordersDuringActivePromotion >= activePromotion.max_qualifying_orders) {
        return null
    }

    return activePromotion
}

export async function updateOrderStatus (orderId: number, newStatus: OrderStatus) {
    const db = await getDb();
    const updatedOrders = await db.all<Pick<DBOrder, 'id' | 'status'>>(`UPDATE orders SET status = '${newStatus}' WHERE id = ${orderId} RETURNING id, status`)
    if (updatedOrders.length !== 1) {
        throw new Error(`Updated ${updatedOrders.length} orders' status instead of the expected 1`)
    }
    if (updatedOrders[0].status !== newStatus) {
        throw new Error("Failed to make requested update to order status")
    }
}