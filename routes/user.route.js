const {addUser, getAllUsers}= require('../controller/user.controller');
const express= require('express')
const router= express.Router();
const{authenticate}= require('../middlewares/auth.middleware')

router.post('/',addUser('user'));
// router.post('/',addUser('admin'));

router.get('/',authenticate,getAllUsers)

module.exports=router;