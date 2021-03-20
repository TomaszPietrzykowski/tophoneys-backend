const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const productController = require("../controller/productController");

router.get("/", productController.getProducts);

router
  .route("/:id")
  .get(productController.getProductById)
  .delete(
    authMiddleware.protect,
    authMiddleware.admin,
    productController.deleteProduct
  );

router.get("/category/:id", productController.getCategory);

module.exports = router;
