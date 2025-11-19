const Purchase = require("../models/purchase.model");
const Product = require("../models/product.model");
exports.createPurchase = async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity, purchaseAt } = req.body;
  const myProduct = await Product.findById(productId);
  if (!myProduct) {
    return res.status(404).json({ message: "error product not found" });
  }
  const myPurchase = await Purchase.create({
    user: userId,
    product: productId,
    price: myProduct.price,
    quantity,
    purchaseAt,
  });
  res.status(201).json({ message: "purchase done", data: myProduct });
};

exports.getAllPurchases = async (req, res) => {
  const purchases = await Purchase.find().populate('user product');
  res.status(200).json({ message: "list of products", data: purchases });
};
exports.getUserPurchase = async (req, res) => {
  const userId = req.user._id;
  const purchases = await Purchase.find({user:userId});
  res.status(200).json({ message: "list of products", data: purchases });
};
