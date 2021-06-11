const express = require("express")
const colors = require("colors")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require("path")
const connectDB = require("./config/db")
const productRouter = require("./router/productRoutes")
const userRouter = require("./router/userRoutes")
const orderRouter = require("./router/orderRoutes")
const uploadRouter = require("./router/uploadRoutes")
const checkoutRouter = require("./router/checkoutRoutes")
const emailRouter = require("./router/emailRoutes")
const errorMiddleware = require("./middleware/errorMiddleware.js")
// initiate
dotenv.config()
connectDB()
const app = express()
// middleware
app.use(cors())
app.use(express.json())
app.use("/api/products", productRouter)
app.use("/api/users", userRouter)
app.use("/api/orders", orderRouter)
app.use("/api/uploads", uploadRouter)
app.use("/api/checkout", checkoutRouter)
app.use("/api/email", emailRouter)
// static
app.use("/public", express.static(path.join(__dirname, "/public")))
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/dist")))
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "dist", "index.html"))
  )
} else {
  app.get("*", (req, res) => {
    res.send("API is running in development mode")
  })
}
// custom error handlers
app.use(errorMiddleware.notFound)
app.use(errorMiddleware.errorHandler)
// let's rock
app.listen()
