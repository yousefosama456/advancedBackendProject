const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/upload.middleware");
const {
  getAllProducts,
  getProductBySlug,
  addProduct,
  deleteProduct,getPaginatedProducts
} = require("../controller/product.controller");
const { authenticate } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const paginate = require("../middlewares/pagination.middlware");
const Product = require("../models/product.model");

router.get("/paginatedProducts", paginate(Product),getPaginatedProducts);
router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);
router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.single("img"),
  addProduct
);

router.delete("/:id", authenticate, authorize("admin"), deleteProduct);

module.exports = router;
