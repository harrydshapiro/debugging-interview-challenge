export interface DBInventoryItem {
    id: number;
    name: string;
    description?: string;
    price: number;
}

export type InventoryItem = {
    id: number;
    name: string;
    description?: string;
    price: number;
}

export function mapDBInventoryItemToInventoryItem (dbInventoryItem: DBInventoryItem): InventoryItem {
    return dbInventoryItem
}