export interface DBPromotion {
    id: number;
    percentage_off: number;
    max_qualifying_orders: number;
    starts_at: number;
    ends_at: number;
}

export type Promotion = {
    id: number;
    percentageOff: number;
    maxQualifyingOrders: number;
    startsAt: Date;
    endsAt: Date;
}

export function mapDBPromotionToPromotion(dbPromotion: DBPromotion): Promotion {
    return {
        id: dbPromotion.id,
        percentageOff: dbPromotion.percentage_off,
        maxQualifyingOrders: dbPromotion.max_qualifying_orders,
        startsAt: new Date(dbPromotion.starts_at * 1000),
        endsAt: new Date(dbPromotion.ends_at * 1000),
    };
}