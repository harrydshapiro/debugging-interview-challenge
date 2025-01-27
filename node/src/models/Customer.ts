export interface DBCustomer {
    id: number;
    first_name: string;
    last_name: string;
    paypal_id: string;
    address: string;
}

export interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    paypalId: string;
    address: string
}
export function mapDBCustomerToCustomer(dbCustomer: DBCustomer): Customer {
    return {
        id: dbCustomer.id,
        firstName: dbCustomer.first_name,
        lastName: dbCustomer.last_name,
        paypalId: dbCustomer.paypal_id,
        address: dbCustomer.address
    };
}