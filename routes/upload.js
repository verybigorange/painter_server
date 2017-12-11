var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();

//上传图片
router.post('/', function(req, res, next) {
    try {
        var form = new formidable.IncomingForm();
        var targetFile = path.join(__dirname,'../public/static/img/');
        form.uploadDir = targetFile;
        form.parse(req,function(err,fields,files){
            if(err) throw err;
            let filename = new Date().getTime() + "$" +files.file.name;
            var oldpath = files.file.path;
            var newpath = path.join(path.dirname(oldpath),filename);
            fs.rename(oldpath,newpath,(err)=>{
                if(err) throw err;
                res.writeHead(200,{"Content-Type":"text/html;charset=UTF8"});
                res.end('/api/static/img/'+filename);
            })
        });
    } catch (error) {
        console.log(error)
    }
   
});

module.exports = router;