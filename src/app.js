const exprees = require('express');
const connectDB=require('./db/db');
const authRoutes=require("./routes/auth.routes")

require('dotenv')
const app = exprees();
app.use(exprees.json());

connectDB();

app.use("/api/auth",authRoutes)


module.exports = app;