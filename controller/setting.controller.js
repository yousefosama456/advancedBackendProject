const {createBackup} = require("../services/db-backup.service")

exports.createBackup=(req,res)=>{

    try{
        createBackup();
        res.status(201).json({message:"backup created"})

    }catch(err){
        res.status(500).json({message:`"backup failed error: ${err.message}` })

    }
}