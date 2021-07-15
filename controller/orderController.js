const Order = require("../model/orderModel")
const asyncHandler = require("express-async-handler")
const Product = require("../model/productModel")
const settings = require("../config/settings")
const { sendConfirmationEmail } = require("./emailController")

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
  const shippingPrice =
    itemsPrice >= 49.9 || shippingAddress.city.toLowerCase() === "purmerend"
      ? 0
      : 4.95
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
    sendConfirmationEmail(
      createdOrder.user.email,
      createdOrder.user.name,
      createdOrder._id,
      "order"
    )
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
  const pageSize = settings.productAdminPageSize
  const page = Number(req.query.pageNumber) || 1
  const count = await Order.countDocuments({})
  const orders = await Order.find({})
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
  res.json({ orders, page, pages: Math.ceil(count / pageSize) })
})
