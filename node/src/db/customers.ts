import { DBCustomer } from "@src/models/Customer";
import { getDb } from "./init";

export async function getCustomer(customerId: number): Promise<DBCustomer | null> {
    const db = await getDb();
    const [customer] = await db.all<DBCustomer>(`SELECT * FROM customers WHERE id = ${customerId}`)
    return customer || null
}