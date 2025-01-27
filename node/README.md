# Debugging Interview Challenge

This is Regal's node debugging interview challenge. 

This interview challenge is intended to increase in difficulty and extend as long as the interview goes - so don't worry about finishing.

We're looking for you to:
- Explain your thought process
- Use data to confirm your hunches/opinions
- Triage issues and address the most urgent ones quickly
- Recommend solutions to address problems long-term/at their root

We aim for this to be as close to real life as possible. That means you can look up docs, discuss changes to product behavior, ask tons of questions, etc. You may use AI tools, with exception of not asking them to explain their own work (we want to confirm that you can explain it yourself).

### Interview structure

1. Set up your env - `cd node && npm i`
2. Take some time to acclimate yourself to the codebase! We'll be starting with issues on the `POST /api/orders/initiate` route, so we recommend scanning through that code path in full.
3. We'll start with some testing issues - run `npm run test`. These test errors are blocking shipping to our Beta customers, so we need to fix them first (the issue is guaranteed to be with the prod code itself, not the tests).
4. Then we'll move to some issues that pop up once we ship to Beta.
5. Finally, we'll discuss some performance issues that appear once we ship to all customers.

### Running the app

`npm run dev` should take care of it for you.

You can use whatever HTTP client you'd like to test the `POST /api/orders/initiate` and `POST /api/orders/confirm` routes.

Here's a sample cURL for the `POST /api/orders/initiate` route: 
```
curl --location 'http://localhost:3000/api/orders/initiate' \
--header 'Content-Type: application/json' \
--data '{
    "customerId": 1,
    "itemIds": [1, 2]
}'
```