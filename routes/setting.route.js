const {createBackup,restoreDatabase}= require('../controller/setting.controller');
const express= require('express')
const router= express.Router();
const {authorize}=require('../middlewares/role.middleware')

const { authenticate } = require('../middlewares/auth.middleware');


router.get('/restore/:folderName',authenticate,authorize('admin'),restoreDatabase)

router.post('/backup',authenticate,authorize('admin'),createBackup)

module.exports=router