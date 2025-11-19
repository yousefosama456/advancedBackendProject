const jwt = require('jsonwebtoken')
const User= require('../models/user.model');

exports.authenticate=async (req,res)=>{
    const authHeader= req.headers.authorization
    console.log(authHeader)
}