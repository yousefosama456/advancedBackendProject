const {addUser, getAllUsers}= require('../controller/user.controller');
const express= require('express')
const router= express.Router();
const{authenticate}= require('../middlewares/auth.middleware')
const {authorize}=require('../middlewares/role.middleware')

router.post('/',addUser('user'));
// router.post('/',addUser('admin'));

router.get('/',authenticate,authorize('admin'),getAllUsers)

module.exports=router;