const express = require('express');
const router = express.Router();

const productController = require('../controller/productController');

// @desc   Fetch all products
// @route  GET /api/products
// @access Public
router.get('/', productController.getProducts);

// @desc   Get product by id
// @route  GET /api/products/:id
// @access Public
router.get('/:id', productController.getProductById);

// @desc   Get products by category
// @route  GET /api/products/category/:id
// @access Public
router.get('/category/:id', productController.getCategory);

module.exports = router;
