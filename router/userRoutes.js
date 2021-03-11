const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");

// @description: Authenticate user & get token
// @route: POST /api/users/login
// @access: Public
router.post("/login", userController.authUser);

// @description: Register new user
// @route: POST /api/users
// @access: Public
router.post("/", userController.registerUser);

module.exports = router;
