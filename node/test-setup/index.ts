import { initializeDb } from "../src/db/init"

function setEnvVars () {
    process.env.NODE_ENV = 'test'
    process.env.DB_FILE_NAME = 'test-setup/db.sqlite'
}

export default async function testSetup () {
    setEnvVars()
    await initializeDb()
}