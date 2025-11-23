const { createBackup } = require("../services/db-backup.service");
const { restoreDatabase } = require("../services/db-restore.service");

exports.createBackup = (req, res) => {
  try {
    createBackup();
    res.status(201).json({ message: "backup created" });
  } catch (err) {
    res.status(500).json({ message: `"backup failed error: ${err.message}` });
  }
};

exports.restoreDatabase = (req, res) => {
  try {
    const folderName=req.params.folderName;

    restoreDatabase(folderName);
    res.status(201).json({ message: "restore data is successful" });
  } catch (err) {
    res.status(500).json({ message: `"restore failed ,error: ${err.message}` });
  }
};
