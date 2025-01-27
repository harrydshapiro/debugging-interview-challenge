export interface DBOrderItem {
    id: number;
    order_id: number;
    item_id: number;
}

export type OrderItem = {
    id: number;
    orderId: number;
    itemId: number;
}

export const mapDBOrderItemToOrderItem = (dbOrderItem: DBOrderItem): OrderItem => {
    return {
        id: dbOrderItem.id,
        orderId: dbOrderItem.order_id,
        itemId: dbOrderItem.item_id,
    };
};