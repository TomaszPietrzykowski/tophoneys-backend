const Product = require('../model/productModel');

exports.getProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
};
exports.getCategory = async (req, res) => {
  const id = req.params.id;
  if (id === 'new') {
    const products = await Product.find().sort({ createdAt: -1 }).limit(10);
    res.json(products);
  } else if (id === 'sale') {
    const products = await Product.find({ isPromo: true });
    res.json(products);
  } else {
    const products = await Product.find({ category: id });
    res.json(products);
  }
};
