const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")
const orderController = require("../controller/orderController")

router
  .route("/")
  .post(orderController.addOrderItems)
  .get(authMiddleware.protect, authMiddleware.admin, orderController.getOrders)

router
  .route("/myorders")
  .get(authMiddleware.protect, orderController.getMyOrders)

router.route("/:id").get(orderController.getOrderById)

router
  .route("/:id/pay")
  .put(authMiddleware.protect, orderController.updateOrderToPaid)

router
  .route("/:id/deliver")
  .put(
    authMiddleware.protect,
    authMiddleware.admin,
    orderController.updateOrderToSent
  )

module.exports = router
