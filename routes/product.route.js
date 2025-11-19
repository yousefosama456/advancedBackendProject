const express=require('express');
const router= express.Router();
const {upload}=require("../middlewares/upload.middleware")
const {getAllProducts, getProductBySlug,addProduct,deleteProduct}=require('../controller/product.controller')

router.get("/", getAllProducts);
router.get("/:slug", getProductBySlug);
router.post("/", upload.single('img'),addProduct);

router.delete("/:id", deleteProduct);



module.exports=router;

