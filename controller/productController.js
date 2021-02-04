const products = require('../data/products');
const Product = require('../model/productModel');

exports.getProducts = (req, res) => {
  res.json(products);
};
exports.getProductById = (req, res) => {
  const product = products.find((p) => p._id === req.params.id);
  res.json(product);
};
exports.getCategory = async () => (req, res) => {
  const id = req.params.id;
  const products = Product.find({ category: id });
  res.json(products);
};
