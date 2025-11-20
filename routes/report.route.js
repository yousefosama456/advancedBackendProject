const {getSalesReport}=require("../controller/sales-report.controller")
const express= require('express');
const router= express.Router();

router.get('/',getSalesReport);

module.exports=router;