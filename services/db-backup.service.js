const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const createBackup = () => {
 const timestamp =new Date().toISOString().replace(/[:.]/g,'-')

  const backupFolder = path.join(
    __dirname,
    "..",
    "backups",
    `backup-${timestamp}`
  );


if(!fs.existsSync(backupFolder)){
    fs.mkdirSync(backupFolder,{recursive:true});
}
const mongoURI =process.env.MONGO_URI;
const command =`mongodump --uri="${mongoURI}" --out="${backupFolder}" --gzip`
exec(command,(error,stdout,stderr)=>{
    if (error){
        console.log(error.message)
    }
    else{
        console.log('backup created || ',stdout)
    }
})
}

module.exports={createBackup}