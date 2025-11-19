const User=require('../models/user.model');
exports.addUser=(role)=>{ return async(req,res)=>{
    const {name,password,email}=req.body;
    const user= await User.create({name,password,email,role});
     console.log("USER ROUTE HIT");
    res.status(201).json({message:'add new user',data:user})
}}

exports.getAllUsers= async(req,res)=>{
    const users= await User.find();
    res.status(200).json({message: "list od users",data:users})
}