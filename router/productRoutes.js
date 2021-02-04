const express = require('express');
const router = express.Router();

const productController = require('../controller/productController');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.get('/category/:id', productController.getCategory);

module.exports = router;
