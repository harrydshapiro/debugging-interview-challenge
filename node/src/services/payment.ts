// TODO: Add stuff here that would lead to 429s due to an in-memory rate limiter
export function chargePaypalAccount (paypalId: string, amount: number) {
    // Imagine we made some API call to PayPal here
    return Promise.resolve({ success: true })
}