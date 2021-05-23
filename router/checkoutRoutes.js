const express = require("express")
const router = express.Router()
const checkoutController = require("../controller/checkoutController")

router.route("/create").post(checkoutController.createPayment)
router.route("/execute").post(checkoutController.executePayment)

module.exports = router
