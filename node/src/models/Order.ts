export type OrderStatus = 'PENDING' | 'CANCELED' | 'CONFIRMED'

export interface DBOrder {
    id: number;
    customer_id: number;
    created_at: number;
    status: OrderStatus
}

export type Order = {
    id: number;
    customerId: number;
    createdAt: Date;
    status: OrderStatus
}

export const mapDBOrderToOrder = (dbOrder: DBOrder): Order => {
    return {
        id: dbOrder.id,
        customerId: dbOrder.customer_id,
        createdAt: new Date(dbOrder.created_at),
        status: dbOrder.status,
    };
};