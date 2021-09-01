const express = require("express")
const router = express.Router()
const checkoutController = require("../controller/checkoutController")

router.route("/create").post(checkoutController.createPayment)
router.route("/execute").post(checkoutController.executePayment)

// Mollie endpoints, refactor later
router.route("/proceed").post(checkoutController.createMolliePayment)
router.route("/webhook/:id").post(checkoutController.paymentWebhook)

module.exports = router
