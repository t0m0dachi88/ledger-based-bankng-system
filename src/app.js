const exprees = require('express');
const connectDB=require('./db/db');
const accountRoutes=require("./routes/account.routes");
const authRoutes=require("./routes/auth.routes")
const cookie=require('cookie-parser');
require('dotenv').config();
const app = exprees();
app.use(exprees.json());
app.use(cookie()) // Use cookie-parser middleware to parse cookies in incoming requests
connectDB();

app.use("/api/auth",authRoutes)
app.use("/api/accounts",accountRoutes)
app.use("/api/transactions",require("../src/routes/transaction.routes"))
module.exports = app;