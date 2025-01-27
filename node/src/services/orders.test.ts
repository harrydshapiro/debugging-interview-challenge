import { createDBOrder } from "@src/db/orders"
import { createInvoice, initiateOrder } from "./orders"
import * as dbOrderMethods from "@src/db/orders"

describe("Orders Service", () => {
    describe("createInvoice", () => {
        it("Does the proper math to determine invoice line items", async () => {
            const getActivePromotionSpy = jest.spyOn(dbOrderMethods, 'getActivePromotion')
            getActivePromotionSpy.mockResolvedValueOnce({
                id: 1,
                percentage_off: 0.2,
                max_qualifying_orders: 100,
                starts_at: 1737999032577,
                ends_at: 1737999032579
            })
            const dbOrder = await createDBOrder({ created_at: 1737999032578, customer_id: 1, status: "PENDING" });
            await dbOrderMethods.createDBOrderItems([{ order_id: dbOrder.id, item_id: 1 }, { order_id: dbOrder.id, item_id: 2 }])
            const invoice = await createInvoice(dbOrder.id, 1);
            expect(invoice).toEqual({
                "costOfItems": 59.98,
                "promotionDiscount": 0.2,
                "shipping": 10,
                "tax": 0.08,
                "total": 58.06,
            }) 
        })
    })

    describe("initiateOrder", () => {
        it("Expect invoice to be generated appopriately, including with the appropriate discount applied", async () => {
            const { invoice } = await initiateOrder(1, [1, 2, 3])
            expect(invoice).toEqual({
                "costOfItems": 89.97,
                "promotionDiscount": 0.2,
                "shipping": 10,
                "tax": 0.08,
                "total": 82.06,
            })
        })
    })
})