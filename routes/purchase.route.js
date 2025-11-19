const express= require('express')
const router= express.Router();
const{authenticate}= require('../middlewares/auth.middleware')
const {authorize}=require('../middlewares/role.middleware')
const{createPurchase,getAllPurchases,getUserPurchase}=require('../controller/purchase.controller')


router.post('/',authenticate,authorize('user'),createPurchase);
router.get('/getUserPurchase',authenticate,authorize('user'),getUserPurchase);
// router.get('/',authenticate,authorize('admin'),getAllPurchases);




module.exports=router;
