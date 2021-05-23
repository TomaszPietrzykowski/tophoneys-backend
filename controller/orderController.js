const Order = require("../model/orderModel")
const asyncHandler = require("express-async-handler")
const Product = require("../model/productModel")

// @description: Create new order
// @route: POST /api/orders
// @access: Private
exports.addOrderItems = asyncHandler(async (req, res) => {
  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
  }

  const { orderItems, shippingAddress, paymentMethod, user } = req.body
  // recalculate prices
  const verifyPrices = async (itemsArray) => {
    for (const item of itemsArray) {
      const { price } = await Product.findById(item.product)
      item.price = price
    }
    return itemsArray
  }
  const outputItems = await verifyPrices(orderItems)
  const itemsPrice = addDecimals(
    outputItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  )
  const shippingPrice = itemsPrice >= 39 ? 0 : 3.95
  // taxPrice = addDecimals(Number((0.1 * cart.itemsPrice).toFixed(2)));
  const taxPrice = 0
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2)

  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error("No order items")
  } else {
    // const user = {}
    // user._id = req.user._id || req.body.user._id
    // user.email = req.user.email || req.body.user.email
    // user.name = req.user.name || req.body.user.name
    const order = new Order({
      orderItems: outputItems,
      user,
      userId: user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })

    const createdOrder = await order.save()

    res.status(201).json(createdOrder)
  }
})

// @description: Get order by Id
// @route: GET /api/orders/:id
// @access: Private
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    res.status(200).json(order)
  } else {
    res.status(404)
    throw new Error("Order not found")
  }
})

// @description: Update order to paid
// @route: PUT /api/orders/:id/pay
// @access: Private
exports.updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    }

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error("Order not found")
  }
})

// @description: Update order to sent
// @route: PUT /api/orders/:id/deliver
// @access: Private/Admin
exports.updateOrderToSent = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()

    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error("Order not found")
  }
})

// @description: Get logged in user orders
// @route: GET /api/orders/myorders
// @access: Private
exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.user._id })
  res.json(orders)
})

// @description: Get all orders
// @route: GET /api/orders
// @access: Private/Admin
exports.getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
  res.json(orders)
})
