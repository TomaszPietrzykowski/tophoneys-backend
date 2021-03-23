const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const productController = require("../controller/productController");

router
  .route("/")
  .get(productController.getProducts)
  .post(
    authMiddleware.protect,
    authMiddleware.admin,
    productController.createProduct
  );

router
  .route("/:id")
  .get(productController.getProductById)
  .delete(
    authMiddleware.protect,
    authMiddleware.admin,
    productController.deleteProduct
  )
  .put(
    authMiddleware.protect,
    authMiddleware.admin,
    productController.updateProduct
  );

router.get("/category/:id", productController.getCategory);

router.get("/search/:keyword", productController.searchProducts);

module.exports = router;
