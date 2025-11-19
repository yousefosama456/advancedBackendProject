const mongoose = require("mongoose");
const purchaseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  price: Number,
  quantity: Number,
  purchaseAt: {
    type: Date,
    default: Date.now,
  },
},{timestamps:true});
module.exports = mongoose.model("Purchase", purchaseSchema);
