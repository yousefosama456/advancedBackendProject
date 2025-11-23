const Product = require("../models/product.model");
const memoryCache = require("../utilities/memory-cache.util");
const cacheKey='productCache'

exports.getAllProducts = async (req, res) => {
  const cachePoducts= memoryCache.get(cacheKey)
  if (cachePoducts){
     return res.status(200).json({ message: "all products using cache memory", data: cachePoducts });
     

  }
  const products = await Product.find({isDeleted:false}).lean();
  memoryCache.set(cacheKey,products)
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

exports.getPaginatedProducts=(req,res)=>{
  res.status(200).json(res.paginatedResult)
}
exports.addProduct = async (req, res) => {
  const { name, desc, price, stock, slug } = req.body;
  const imgURL = req.file.filename;
  const product = await Product.create({
    name,
    desc,
    price,
    stock,
    imgURL,
    slug,
  });
  memoryCache.del(cacheKey)
  res.status(201).json({ message: "product cretad", data: product });
};

exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByIdAndUpdate(id, { isDeleted: true });
  if (product) {
    res.status(200).json({ message: "product deleted", data: product });
      memoryCache.del(cacheKey)

  } else {
    res.status(404).json({ message: "error, product not found" });
  }
};
