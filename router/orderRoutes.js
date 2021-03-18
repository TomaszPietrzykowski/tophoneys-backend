const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const orderController = require("../controller/orderController");

// @description: Create new order
// @route: POST /api/orders
// @access: Private
router.route("/").post(authMiddleware.protect, orderController.addOrderItems);

// @description: Get logged in user orders
// @route: GET /api/orders/myorders
// @access: Private
router
  .route("/myorders")
  .get(authMiddleware.protect, orderController.getMyOrders);

// @description: Get order by Id
// @route: POST /api/orders/:id
// @access: Private
router.route("/:id").get(authMiddleware.protect, orderController.getOrderById);

// @description: Update order to paid
// @route: PUT /api/orders/:id/pay
// @access: Private
router
  .route("/:id/pay")
  .put(authMiddleware.protect, orderController.updateOrderToPaid);

module.exports = router;
