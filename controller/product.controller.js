const Product = require("../models/product.model");

exports.getAllProducts = async (req, res) => {
  const products = await Product.find({isDeleted:false});
  res.status(200).json({ message: "all products", data: products });
};

exports.getProductBySlug = async (req, res) => {
  const slug = req.params.slug;
  const product = await Product.findOne({ slug });
  if (product) {
    res.status(200).json({ message: `product (${slug}) info`, data: product });
  } else {
    res.status(404).json({ message: "error, product not found" });
  }
};

exports.addProduct = async (req, res) => {
  const { name, desc, price, stock } = req.body;
  const imgURL = req.file.filename;
  const product = await Product.create({ name, desc, price, stock, imgURL });
  res.status(201).json({ message: "product cretad", data: product });
};

exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByIdAndUpdate(id, { isDeleted: true });
  if (product) {
    res.status(200).json({ message: "product deleted", data: product });
  } else {
    res.status(404).json({ message: "error, product not found" });
  }
};
