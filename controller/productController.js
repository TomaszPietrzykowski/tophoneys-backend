const Product = require("../model/productModel")
const asyncHandler = require("express-async-handler")
const fs = require("fs")
const path = require("path")
const settings = require("../config/settings")
const randomizeResponse = require("../utils/randomizeResponse")

// @description: Fetch all products
// @route: GET /api/products
// @access: Public
exports.getProducts = asyncHandler(async (req, res) => {
  const pageSize = settings.productAdminPageSize
  const page = Number(req.query.pageNumber) || 1
  const count = await Product.countDocuments({})
  const products = await Product.find({})
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @description: Fetch random products
// @route: GET /api/products/featured
// @access: Public/App
exports.getRandomProducts = asyncHandler(async (req, res) => {
  const amount = Number(req.query.number) || 5
  const products = await Product.find({})
  const response = randomizeResponse(products, amount)
  res.json(response)
})

// @description: Fetch single product
// @route: GET /api/products/:id
// @access: Public
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    res.json(product)
  } else {
    res.status(404).json({ message: "Product not found" })
  }
})

// @description:   Get products by category
// @route:  GET /api/products/category/:id
// @access: Public
exports.getCategory = asyncHandler(async (req, res) => {
  const pageSize = settings.productCategoryPageSize
  const page = Number(req.query.pageNumber) || 1
  const id = req.params.id
  if (id === "new") {
    const count = await Product.countDocuments({})
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
    res.json({ products, page, pages: Math.ceil(count / pageSize) })
  } else if (id === "sale") {
    const count = await Product.countDocuments({ isPromo: true })
    const products = await Product.find({ isPromo: true })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
    res.json({ products, page, pages: Math.ceil(count / pageSize) })
  } else {
    const count = await Product.countDocuments({ category: id })
    const products = await Product.find({ category: id })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
    res.json({ products, page, pages: Math.ceil(count / pageSize) })
  }
})

// @description:   Get products by keyword
// @route:  GET /api/products/search/:keyword
// @access: Public
exports.searchProducts = asyncHandler(async (req, res) => {
  const keyword = req.params.keyword
  const pageSize = settings.productSearchPageSize
  const page = Number(req.query.pageNumber) || 1

  if (keyword) {
    const search = {
      name: {
        $regex: keyword,
        $options: "i",
      },
    }
    const count = await Product.countDocuments({ ...search })
    const products = await Product.find({ ...search })
      .limit(pageSize)
      .skip(pageSize * (page - 1))

    res.json({ products, page, pages: Math.ceil(count / pageSize) })
  } else {
    const count = await Product.countDocuments({})
    const products = await Product.find({})
    res.json({ products, page, pages: Math.ceil(count / pageSize) })
  }
})

// @description: Delete product
// @route: DELETE /api/products/:id
// @access: Private/Admin
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    const img = product.image
    fs.unlinkSync(path.join(__dirname, "../", img))
    await product.remove()
    res.json({ message: "Product removed" })
  } else {
    res.status(404).json({ message: "Product not found" })
  }
})

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
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @description: Update product
// @route: PUT /api/products/:id
// @access: Private/Admin
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    product.name = req.body.name || product.name
    product.user = req.user._id
    product.image = req.body.image || product.image
    product.description = req.body.description || product.description
    product.brand = req.body.brand || ""
    product.category = req.body.category || product.category
    product.capacity = req.body.capacity || product.capacity
    product.capacityDropdown =
      req.body.capacityDropdown || product.capacityDropdown
    product.price = req.body.price || product.price
    product.previousPrice = req.body.previousPrice || product.previousPrice
    product.countInStock = req.body.countInStock || product.countInStock
    product.countryOfOrigin = req.body.countryOfOrigin || ""
    product.isPromo = req.body.isPromo
    product.isPublished = req.body.isPublished

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error("Product not found")
  }
})
