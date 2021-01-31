const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRouter = require('./routes/productRoutes');

dotenv.config();
connectDB();
const app = express();

app.use('/api/products', productRouter);
app.use('/api/products/:id', productRouter);

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} on port ${PORT}`.yellow.bold
  )
);
