import { initializeDb } from "../src/db/init"

export default async function testSetup () {
    await initializeDb()
}