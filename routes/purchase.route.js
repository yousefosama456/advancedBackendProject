const express= require('express')
const router= express.Router();
const{authenticate}= require('../middlewares/auth.middleware')
const {authorize}=require('../middlewares/role.middleware')
const{createPurchase}=require('../controller/purchase.controller')


router.post('/',authenticate,authorize('user'),createPurchase);


module.exports=router;
