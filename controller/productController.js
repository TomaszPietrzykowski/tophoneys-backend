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

// @description: Delete product
// @route: DELETE /api/products/:id
// @access: Private/Admin
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

// @description: Create product
// @route: POST /api/products
// @access: Private/Admin
exports.createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: req.body.name,
    user: req.user._id,
    image: req.body.image,
    description: req.body.description,
    brand: req.body.brand,
    category: req.body.category,
    capacity: req.body.capacity,
    capacityDropdown: req.body.capacityDropdown,
    price: req.body.price,
    countInStock: req.body.countInStock,
    countryOfOrigin: req.body.countryOfOrigin,
    isPromo: req.body.isPromo,
    isPublished: req.body.isPublished,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @description: Update product
// @route: PUT /api/products/:id
// @access: Private/Admin
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = req.body.name || product.name;
    product.user = req.user._id || product.user;
    product.image = req.body.image || product.image;
    product.description = req.body.description || product.description;
    product.brand = req.body.brand || product.brand;
    product.category = req.body.category || product.category;
    product.capacity = req.body.capacity || product.capacity;
    product.capacityDropdown =
      req.body.capacityDropdown || product.capacityDropdown;
    product.price = req.body.price || product.price;
    product.countInStock = req.body.countInStock || product.countInStock;
    product.countryOfOrigin =
      req.body.countryOfOrigin || product.countryOfOrigin;
    product.isPromo = req.body.isPromo || product.isPromo;
    product.isPublished = req.body.isPublished || product.isPublished;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
