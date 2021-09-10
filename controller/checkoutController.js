const asyncHandler = require("express-async-handler")
const Order = require("../model/orderModel")
const { sendConfirmationEmail } = require("./emailController")
const { createMollieClient } = require("@mollie/api-client")
const logger = require("../Logger")
const dotenv = require("dotenv")
dotenv.config()
// Create mollie client
const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_LIVE_API_KEY,
})

// @description: Create mollie payment
// @route: POST /api/checkout/proceed
// @payload: orderID
// @access: App/Mollie
exports.createMolliePayment = asyncHandler(async (req, res) => {
  // 1. Get the payment ID from the request body.
  const orderID = req.body.orderID
  const order = await Order.findById(orderID)
  const total = order.totalPrice
  mollieClient.payments
    .create({
      amount: {
        value: total.toFixed(2),
        currency: "EUR",
      },
      locale: "nl-NL",
      description: `TOP HONEYS \nOrder: ${orderID}`,
      redirectUrl: `${process.env.HOME_DOMAIN}/order/${orderID}?redirect=mollie`,
      webhookUrl: `${process.env.HOME_DOMAIN}/api/checkout/webhook/${orderID}`,
    })
    .then((payment) => {
      // Forward the customer to the payment.getCheckoutUrl()
      order.paymentId = payment.id
      let checkoutUrl = payment.getCheckoutUrl()
      res.json({ checkoutUrl })
    })
    .catch((error) => {
      console.log(error)
      logger.log({ msg: `Create mollie payment error:\n${error}` })
      res.status(500).json({ message: "Error creating payment" })
    })
})

// @description: Webhook triggered by Mollie on status change
// @route: POST /api/checkout/webhook/:id
// @access: App/Mollie
exports.paymentWebhook = asyncHandler(async (req, res) => {
  // 1. Get the order ID from url.
  const orderID = req.params.orderId
  // 2. Get the payment ID from req body.
  const paymentID = req.body.id
  // 3. Get updated order state
  console.log("3. payment id:", paymentID)
  mollieClient.payments
    .get(paymentID)
    .then(async (payment) => {
      // Check if the payment.isPaid()
      if (payment.isPaid()) {
        // 2. Update order to paid in database
        const order = await Order.findById(orderID)
        if (order && !order.isPaid) {
          order.isPaid = true
          order.paidAt = Date.now()
          order.paymentId = `${paymentID}`
          order.paymentResult = { ...payment }
          await order.save()

          // 3. Send purchase confirmation email
          sendConfirmationEmail(
            order.user.email,
            order.user.name,
            order._id,
            "purchase"
          )
        }
        // send 200 to mollie to trigger user redirect
        res.send(200)
      }
    })
    .catch((error) => {
      logger.log({ msg: `mollie webhook error:\n${error}` })
    })
})
