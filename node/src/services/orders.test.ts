import { initiateOrder } from "./orders"

describe("Orders Service", () => {
    describe("initiateOrder", () => {
        it("Expect promotion to be applied", async () => {
            const result = await initiateOrder(1, [1, 2, 3])
            console.log("result is", { result })
            console.log("process env", process.env.DB_FILE_NAME)
            expect(true).toBeTruthy()
        })
    })
})