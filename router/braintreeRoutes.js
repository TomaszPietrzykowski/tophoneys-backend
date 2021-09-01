const express = require("express")
const router = express.Router()

// Initialize the Braintree SDK:
// 1. Import the Braintree SDK module
const braintree = require("braintree")
// 2. Set up a gateway using your Braintree access token

//
// 3. Set up a URL to return a client token to the browser
router.route("/token").get(function (req, res) {
  const gateway = braintree.connect({
    accessToken: process.env.BRAINTREE_SANDBOX_ACCESS_TOKEN,
  })
  gateway.clientToken.generate({}, function (err, response) {
    res.json(response.clientToken)
  })
})

//
// Execute the payment:
// 1. Set up a URL to handle requests from the PayPal button
router.route("/execute").post(function (req, res) {
  // 2. Get the nonce from the request body
  const nonce = req.body.nonce
  // 3. Set up the parameters to execute the payment
  const saleRequest = {
    amount: "13.37",
    paymentMethodNonce: nonce,
    options: {
      submitForSettlement: true,
    },
  }
  // 4. Call the Braintree gateway to execute the payment
  gateway.transaction.sale(saleRequest, function (err, result) {
    if (err || !result.success) {
      return res.status(500).json({ status: "error" })
    }
    // 5. Return a success response to the client
    return res
      .status(200)
      .json({ status: "success", id: result.transaction.id })
  })
})

module.exports = router
