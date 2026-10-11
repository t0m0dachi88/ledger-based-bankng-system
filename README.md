# Banking System Ledger

A backend banking service built around a **double-entry ledger**. Money never "lives" in a balance field. Every transfer writes an immutable DEBIT and CREDIT entry, and an account's balance is always calculated from those entries.

Built with Node.js, Express 5 and MongoDB.

## Why this project

Most simple banking demos store a `balance` number and update it directly, which breaks the moment two requests overlap or a request gets retried. This project tries to do it the way real ledgers work:

- **Balances are derived, not stored.** The balance is `sum(CREDIT) - sum(DEBIT)` over an account's ledger entries.
- **Ledger entries are immutable.** The schema blocks updates and deletes, so history can't be quietly rewritten.
- **Transfers are atomic.** The transaction record and both ledger entries are written inside one MongoDB session, so you never end up with a debit without its credit.
- **Transfers are idempotent.** Every transfer carries a unique `idempotencyKey`, so a retried request can't move money twice.

## Features

- User registration, login and logout with JWT (cookie or `Authorization: Bearer` header)
- Token blacklist on logout, auto-expiring after 3 days via a MongoDB TTL index
- Password hashing with bcrypt
- Multiple accounts per user, with `ACTIVE`, `FROZEN` and `CLOSED` statuses
- Balance calculation through a MongoDB aggregation over the ledger
- Money transfers between accounts with idempotency handling
- System-user-only endpoint for seeding initial funds
- Email notifications (registration and transaction) through Gmail OAuth2 with Nodemailer

## Tech stack

| Area | Tool |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | MongoDB with Mongoose 9 |
| Auth | JSON Web Tokens, bcrypt / bcryptjs, cookie-parser |
| Email | Nodemailer (Gmail OAuth2) |
| Dev | nodemon |

## Project structure

```
banking-system-ledger/
├── server.js                  # Entry point, loads env, connects DB, starts server
└── src/
    ├── app.js                 # Express app and route mounting
    ├── config/db.js           # MongoDB connection
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── account.controller.js
    │   └── transaction.controller.js
    ├── middleware/auth.middleware.js   # User auth + system-user auth
    ├── models/
    │   ├── user.model.js
    │   ├── account.model.js            # Includes getBalance()
    │   ├── transaction.model.js
    │   ├── ledger.model.js             # Immutable entries
    │   └── blackList.model.js          # Logged-out tokens (TTL)
    ├── routes/
    └── services/email.service.js
```

## How a transfer works

`POST /api/transactions` runs through these steps:

1. Validate the request body
2. Check the idempotency key (return the existing result if it was already processed)
3. Confirm both accounts are `ACTIVE`
4. Derive the sender's balance from the ledger and check it covers the amount
5. Create the transaction as `PENDING`
6. Write the DEBIT ledger entry
7. Write the CREDIT ledger entry
8. Mark the transaction `COMPLETED`
9. Commit the MongoDB session
10. Send an email notification

Steps 5 to 9 happen inside a single MongoDB transaction.

> **Note:** MongoDB transactions need a replica set. A local standalone `mongod` won't work. MongoDB Atlas works out of the box, or you can start a local single-node replica set.

## Getting started

### Prerequisites

- Node.js 18 or newer
- A MongoDB replica set (Atlas or a local one)
- A Google Cloud project with Gmail OAuth2 credentials (only needed for email notifications)

### Installation

```bash
git clone https://github.com/<your-username>/banking-system-ledger.git
cd banking-system-ledger
npm install
```

### Environment variables

Create a `.env` file in the project root:

```env
# Database
DB=mongodb+srv://<user>:<password>@<cluster>/<dbname>

# Auth
JWT_SECRET=your_long_random_secret

# Email (Gmail OAuth2)
EMAIL_USER=your_email@gmail.com
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
REFRESH_TOKEN=your_google_refresh_token
```

### Run

```bash
npm run dev     # with nodemon
npm start       # plain node
```

The server starts on **http://localhost:3000**.

## API reference

Protected routes accept the JWT either from the `token` cookie or an `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a user (`name`, `email`, `password`) |
| POST | `/api/auth/login` | Log in (`email`, `password`) |
| POST | `/api/auth/logout` | Log out and blacklist the token |

### Accounts (protected)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/accounts` | Create a new account for the logged-in user |
| GET | `/api/accounts` | List the logged-in user's accounts |
| GET | `/api/accounts/balance/:accountId` | Get an account's balance |

### Transactions

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/transactions` | User | Transfer money between two accounts |
| POST | `/api/transactions/system/initial-funds` | System user | Credit an account from the system account |

**Transfer request**

```json
{
  "fromAccount": "<accountId>",
  "toAccount": "<accountId>",
  "amount": 500,
  "idempotencyKey": "unique-key-per-transfer"
}
```

Re-sending the same `idempotencyKey` returns the original result instead of creating a second transfer.

### System user

The initial-funds endpoint is restricted to users with `systemUser: true`. That flag is immutable and hidden by default, so it has to be set when the user document is created (for example, inserted directly in the database). The system user also needs its own account to fund others from.

## Data model

- **User**: email, name, hashed password, `systemUser`
- **Account**: user, status, currency (default `INR`)
- **Transaction**: fromAccount, toAccount, amount, status (`PENDING`, `COMPLETED`, `FAILED`, `REVERSED`), idempotencyKey
- **Ledger**: account, transaction, amount, type (`CREDIT` or `DEBIT`), immutable
- **TokenBlackList**: token, expires after 3 days

## Roadmap

- Automated tests
- Input validation on request bodies
- Rate limiting on auth routes
- Reversal flow for the `REVERSED` status
- Transaction history endpoint
- Swagger / OpenAPI docs

## License

Released under the [MIT License](LICENSE).
