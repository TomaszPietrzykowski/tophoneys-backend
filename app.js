const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");
const productRouter = require("./router/productRoutes");
const userRouter = require("./router/userRoutes");
const orderRouter = require("./router/orderRoutes");
const uploadRouter = require("./router/uploadRoutes");
const errorMiddleware = require("./middleware/errorMiddleware.js");

dotenv.config();
connectDB();
const app = express();

app.use(express.json());

app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/orders", orderRouter);
app.use("/api/upload", uploadRouter);

app.use("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

app.use("/public", express.static(path.join(__dirname, "/public")));

app.use(errorMiddleware.notFound);
app.use(errorMiddleware.errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} on port: ${PORT}`.yellow.bold
  )
);
