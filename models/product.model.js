const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { String },
    price: Number,
    imgURL: String,
    stock: Number,
    isDeleted: { type: Boolean },
    slug: { type: String, required: true, unique: true },
  },
  { timpstamps: true }
);
module.exports = mongoose.model("Product", productSchema);
