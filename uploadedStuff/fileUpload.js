// fileUpload.js 20250821
var express = require('express');
var router = express.Router();
const multer = require('multer');
const upload = multer({dest:'tmp/', limits: { fileSize: 1024*1024 /* in bytes */}});
const fs = require('fs');
router.post('/single', upload.single('myFile'), (req, res, next) => {
    if (!fs.existsSync("upload")) fs.mkdirSync("upload");
    fs.renameSync(req.file.path, "upload/" + 
        Buffer.from(req.file.originalname, 'latin1').toString('UTF-8'));
    res.send("file uploaded");
}).post('/multiple', upload.array('myFile'), async (req, res, next) => {
    if (!fs.existsSync("upload")) fs.mkdirSync("upload");
    for (let f of req.files) fs.renameSync(f.path, "upload/" + f.originalname);
    res.send(req.files.length + " files uploaded");
}).post('/different', upload.fields([
        { name: 'aFile', maxCount: 1 }, 
        { name: 'bFile', maxCount: 2 }
    ]), (req, res, next) => {
    if (!fs.existsSync("upload")) fs.mkdirSync("upload");
    fs.renameSync(req.files.aFile[0].path, "upload/" + req.files.aFile[0].originalname);
    for (let f of req.files.bFile) fs.renameSync(f.path, "upload/abc/" + f.originalname);
    res.send(" files uploaded");
});
module.exports = router;
