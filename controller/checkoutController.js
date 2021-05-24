const asyncHandler = require("express-async-handler")
const checkoutNodeJssdk = require("@paypal/checkout-server-sdk")
const payPalClient = require("../config/payPalClient")
const Order = require("../model/orderModel")

// @description: Create payment
// @route: POST /api/checkout/create
// @access: App/Paypal
exports.createPayment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.body.customOrderId)

  function buildRequestBody() {
    return {
      intent: "CAPTURE",
      application_context: {
        return_url: "https://www.example.com",
        cancel_url: "https://www.example.com",
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
          soft_descriptor: "HighFashions",
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
              country_code: "NL",
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
  // 2. Get the payment ID from the request body.
  const orderID = req.body.orderID

  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID)
  request.requestBody({})

  const capture = await payPalClient.client().execute(request)

  // 4. Update order to paid in database
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
  }
  // 5. Return a successful response to the client
  res.status(200).send(capture)
})
