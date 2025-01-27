import { AsyncDatabase } from "promised-sqlite3";

export function getDb () {
    return AsyncDatabase.open("./db.sqlite");
}

export async function initializeDb () {
    const db = await getDb()
    await db.exec(`
        DROP TABLE IF EXISTS inventory_items;
        DROP TABLE IF EXISTS orders;
        DROP TABLE IF EXISTS order_items;
        DROP TABLE IF EXISTS promotions;

        CREATE TABLE IF NOT EXISTS inventory_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL
        );
                         
        CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            paypal_id TEXT NOT NULL,
            address TEXT NOT NULL
        );
                         
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_id INTEGER NOT NULL,
            created_at INTEGER NOT NULL,
            status TEXT NOT NULL DEFAULT 'PENDING',
            FOREIGN KEY (customer_id) REFERENCES customers(id)
        );

        CREATE TABLE IF NOT EXISTS order_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            item_id INTEGER NOT NULL,
            FOREIGN KEY (order_id) REFERENCES orders(id),
            FOREIGN KEY (item_id) REFERENCES inventory_items(id)
        );
                   
        CREATE TABLE IF NOT EXISTS promotions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            percentage_off REAL NOT NULL,
            max_qualifying_orders INTEGER NOT NULL,
            starts_at INTEGER NOT NULL,
            ends_at INTEGER NOT NULL
        );
        
        -- Insert promotion for all of 2025
        INSERT INTO promotions (percentage_off, max_qualifying_orders, starts_at, ends_at) VALUES (
            0.2, 
            100,
            1735689600000,
            1767225600000
        );

        INSERT INTO inventory_items (name, description, price) VALUES 
        ('T-Shirt', 'A plain white t-shirt', 9.99),
        ('Jeans', 'Blue denim jeans', 49.99),
        ('Sweater', 'A warm wool sweater', 29.99),
        ('Jacket', 'A waterproof jacket', 59.99),
        ('Socks', 'A pair of cotton socks', 4.99),
        ('Hat', 'A stylish hat', 19.99),
        ('Scarf', 'A wool scarf', 14.99),
        ('Gloves', 'A pair of leather gloves', 24.99),
        ('Belt', 'A leather belt', 19.99),
        ('Shoes', 'A pair of running shoes', 79.99),
        ('Shorts', 'A pair of athletic shorts', 24.99),
        ('Dress', 'A summer dress', 39.99);
    `)
}
