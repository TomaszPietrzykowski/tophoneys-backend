const asyncHandler = require("express-async-handler")
const checkoutNodeJssdk = require("@paypal/checkout-server-sdk")
const payPalClient = require("../config/payPalClient")
const Order = require("../model/orderModel")
const { sendConfirmationEmail } = require("./emailController")

// @description: Create payment
// @route: POST /api/checkout/create
// @access: App/Paypal
exports.createPayment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.body.customOrderId)
  function buildRequestBody() {
    const countryCode = order.shippingAddress.country
      .toLowerCase()
      .startsWith("be")
      ? "BE"
      : "NL"
    return {
      intent: "CAPTURE",
      application_context: {
        return_url: `${process.env.HOME_DOMAIN}/order/${req.body.customOrderId}`,
        cancel_url: `${process.env.HOME_DOMAIN}/order/${req.body.customOrderId}`,
        brand_name: "TOP HONEYS",
        locale: "en-US",
        landing_page: "BILLING",
        shipping_preference: "SET_PROVIDED_ADDRESS",
        user_action: "CONTINUE",
      },
      payer: {
        email_address: req.body.email,
      },
      purchase_units: [
        {
          reference_id: order._id,
          description: "Top Honeys Order",

          custom_id: order._id,
          soft_descriptor: "BestHoneysEver",
          amount: {
            currency_code: "EUR",
            value: order.totalPrice,
          },
          items: [],
          shipping: {
            name: {
              full_name: req.body.name,
            },
            address: {
              address_line_1: order.shippingAddress.address,
              address_line_2: "",
              admin_area_2: order.shippingAddress.city,
              admin_area_1: order.shippingAddress.country,
              postal_code: order.shippingAddress.postalCode,
              country_code: countryCode,
            },
          },
        },
      ],
    }
  }

  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest()

  request.headers["prefer"] = "return=representation"
  request.requestBody(buildRequestBody())
  const response = await payPalClient.client().execute(request)

  res.json(response)
})

// @description: Execute payment
// @route: POST /api/checkout/execute
// @access: App/Paypal
exports.executePayment = asyncHandler(async (req, res) => {
  // 1. Get the payment ID from the request body.
  const orderID = req.body.orderID

  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID)
  request.requestBody({})

  const capture = await payPalClient.client().execute(request)

  // 2. Update order to paid in database
  const order = await Order.findById(
    capture.result.purchase_units[0].payments.captures[0].custom_id
  )

  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      ...capture.result,
    }

    await order.save()
    // 3. Send purchase confirmation email
    sendConfirmationEmail(
      order.user.email,
      order.user.name,
      order._id,
      "purchase"
    )
  }

  // 4. Return a successful response to the client
  res.status(200).send(capture)
})

//
//
//         MOLLIE --------------------------------------------------
//
//

const { createMollieClient } = require("@mollie/api-client")

// create client
const mollieClient = createMollieClient({
  apiKey: "test_dHar4XY7LxsDOtmnkVtjNVWXLSlXsM",
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
        value: total,
        currency: "EUR",
      },
      description: `Order: ${orderID}`,
      redirectUrl: `${process.env.HOME_DOMAIN}/order/${orderID}`,
      webhookUrl: `${process.env.HOME_DOMAIN}/api/checkout/webhook/${orderID}`,
    })
    .then((payment) => {
      // Forward the customer to the payment.getCheckoutUrl()
      let checkoutUrl = payment.getCheckoutUrl()
      console.log(checkoutUrl)
      res.redirect(checkoutUrl)
    })
    .catch((error) => {
      // Handle the error
      console.log(error)
    })
  // NEAT UP ERROR HANDLING HERE................, send res
})

// @description: Webhook triggered by Mollie on status change
// @route: POST /api/checkout/webhook/:id
// @access: App/Mollie
exports.paymentWebhook = asyncHandler(async (req, res) => {
  // 1. Get the order ID from url.
  const orderID = req.params.id
  // 1. Get the payment ID from req body.
  const paymentID = req.body.id

  // 3. Get updated order state
  const paymentData = await axios.get(
    `https://api.mollie.com/v2/payments/${paymentID}`
  )
  console.log(paymentData)
  //
  //
  // update order to paid if success

  res.send(200)
})
