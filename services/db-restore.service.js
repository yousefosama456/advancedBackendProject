const {exec}= require('child_process');
const path =require('path');

const restoreDatabase=(folderName)=>{
    const backupPath=path.join(__dirname,'..','backups',folderName,'advancedbackendtuesday');
    const mongoURI=process.env.MONGO_URI;
    const command =`mongorestore --uri="${mongoURI}" --drop --gzip "${backupPath}"`
    exec(command,(error,stdout,stderr)=>{
        if(error){
            console.log(error.message)
        }
         console.log(stdout)

    })
}


module.exports={restoreDatabase}