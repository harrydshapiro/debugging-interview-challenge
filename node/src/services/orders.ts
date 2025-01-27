import { createDBOrder, createDBOrderItems, getActivePromotion, getAllInventoryItemsInOrder, getDBOrderById, updateOrderStatus } from "@src/db/orders";
import { mapDBOrderToOrder, Order } from "@src/models/Order";
import { mapDBOrderItemToOrderItem, OrderItem } from "@src/models/OrderItem";
import { Invoice } from "@src/models/Invoice";
import { mapDBInventoryItemToInventoryItem } from "@src/models/InventoryItem";
import { chargePaypalAccount } from "./payment";
import { getCustomer } from "@src/db/customers";
import { now } from "@src/utils/time";
import Bottleneck from "bottleneck";

export async function initiateOrder (customerId: number, itemIds: number[]): 
    Promise<{
        order: Order, 
        orderItems: OrderItem[], 
        invoice: Invoice 
    }> {
    const dbOrder = await createDBOrder({ created_at: now(), customer_id: customerId, status: 'PENDING' });
    const order = mapDBOrderToOrder(dbOrder);
    
    const dbOrderItems = await createDBOrderItems(itemIds.map((id) => ({ item_id: id, order_id: dbOrder.id })));
    const orderItems = dbOrderItems.map(mapDBOrderItemToOrderItem);
    
    const invoice = await createInvoice(order.id, customerId)

    return {
        order,
        orderItems,
        invoice
    }
}

export async function confirmOrder(orderId: number) {
    const order = await getDBOrderById(orderId)
    if (!order) {
        throw new Error('Could not find order in DB')
    }

    const dbCustomer = await getCustomer(order.customer_id)
    if (!dbCustomer) {
        throw new Error('Could not find customer in DB')
    }

    const invoice = await createInvoice(order.id, dbCustomer.id)
    const paymentResult = await chargePaypalAccount(dbCustomer.paypal_id, invoice.total)
    if (paymentResult.success) {
        await updateOrderStatus(orderId, 'CONFIRMED')
    }
    return paymentResult.success
}

/**
 * Determines the total cost of an order, as well as its individual line items.
 * Promotion is applied to the cost of the items prior to shipping + tax.
 */
export async function createInvoice (orderId: number, customerId: number): Promise<Invoice> {
    const order = await getDBOrderById(orderId)
    if (!order) {
        throw new Error("Cannot create invoice for missing order")
    }
    const inventoryItems = (await getAllInventoryItemsInOrder(orderId)).map(mapDBInventoryItemToInventoryItem)
    const totalInvetoryItemsCost = roundToHundrethsPlace(inventoryItems.reduce<number>((acc, curr) => acc += curr.price, 0))  ;

    const shipping = await getShipping(customerId)
    const tax = await getSalesTax(customerId)
    const activePromotion = await getActivePromotion(order.created_at);
    const promotionDiscount = activePromotion?.percentage_off || 0;
    const total = roundToHundrethsPlace(totalInvetoryItemsCost + shipping + tax - (totalInvetoryItemsCost - promotionDiscount));

    return {
        shipping,
        tax,
        costOfItems: totalInvetoryItemsCost,
        promotionDiscount, 
        total,
    }
}

// In-Memory rate limiter
const shippingApiRateLimiter = new Bottleneck({
    minTime: 100, // Rate limits to 10 per second
})

function getShipping (customerId: number): Promise<number> {
    // Imagine we hit some USPS API
    // "schedule" adds a job to the rate limiter
    return shippingApiRateLimiter.schedule(() => Promise.resolve(10))
}

function getSalesTax (customerId: number): Promise<number> {
    // Imagine we hit some IRS API
    return Promise.resolve(0.08);
}

function roundToHundrethsPlace (number: number): number {
    return Math.round(number * 100) / 100
}