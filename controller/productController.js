const Product = require("../model/productModel");
const asyncHandler = require("express-async-handler");

// @description: Fetch all products
// @route: GET /api/products
// @access: Public
exports.getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @description: Fetch single product
// @route: GET /api/products/:id
// @access: Public
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// @description:   Get products by category
// @route:  GET /api/products/category/:id
// @access: Public
exports.getCategory = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (id === "new") {
    const products = await Product.find().sort({ createdAt: -1 }).limit(10);
    res.json(products);
  } else if (id === "sale") {
    const products = await Product.find({ isPromo: true });
    res.json(products);
  } else {
    const products = await Product.find({ category: id });
    res.json(products);
  }
});
