const express = require("express")
const router = express.Router()
const checkoutController = require("../controller/checkoutController")

// Mollie endpoints, refactor later
router.route("/proceed").post(checkoutController.createMolliePayment)
router.route("/webhook/:orderId").post(checkoutController.paymentWebhook)

module.exports = router
