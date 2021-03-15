const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const orderController = require("../controller/orderController");

// @description: Create new order
// @route: POST /api/orders
// @access: Private
router.route("/").post(authMiddleware.protect, orderController.addOrderItems);

module.exports = router;
