const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const orderController = require("../controller/orderController");

router
  .route("/")
  .post(authMiddleware.protect, orderController.addOrderItems)
  .get(authMiddleware.protect, authMiddleware.admin, orderController.getOrders);

router
  .route("/myorders")
  .get(authMiddleware.protect, orderController.getMyOrders);

router.route("/:id").get(authMiddleware.protect, orderController.getOrderById);

router
  .route("/:id/pay")
  .put(authMiddleware.protect, orderController.updateOrderToPaid);

module.exports = router;
