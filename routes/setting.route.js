const {createBackup}= require('../controller/setting.controller');
const express= require('express')
const router= express.Router();


router.post('/backup',createBackup)

module.exports=router