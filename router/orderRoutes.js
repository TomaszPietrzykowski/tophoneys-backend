const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const orderController = require("../controller/orderController");

// @description: Create new order
// @route: POST /api/orders
// @access: Private
router.route("/").post(authMiddleware.protect, orderController.addOrderItems);

// @description: Get order by Id
// @route: POST /api/orders/:id
// @access: Private
router.route("/:id").get(authMiddleware.protect, orderController.getOrderById);

module.exports = router;
