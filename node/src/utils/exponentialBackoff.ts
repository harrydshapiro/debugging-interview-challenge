export async function exponentialBackoff<T>(
    asyncFunction: () => Promise<T>,
    retries: number = 5,
    delay: number = 1000,
    factor: number = 2
): Promise<T> {
    let attempt = 0;

    while (attempt < retries) {
        try {
            return await asyncFunction();
        } catch (error) {
            attempt++;
            if (attempt >= retries) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= factor;
        }
    }

    throw new Error('Exponential backoff failed after maximum retries');
}