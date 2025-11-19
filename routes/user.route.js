const {addUser}= require('../controller/user.controller');
const express= require('express')
const router= express.Router();

router.post('/',addUser('user'));
// router.post('/',addUser('admin'));

module.exports=router;