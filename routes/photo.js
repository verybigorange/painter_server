var express = require('express');
var router = express.Router();

var query=require("./mysql_pool");  

//查照片
router.post('/', function(req, res, next) {
    let limitNum = req.body.limit;
    let str = limitNum?" LIMIT "+limitNum:"";
    query("SELECT * FROM photo"+str, [1], function(err,results,fields){  
        res.send(results);
    });
});


//添加照片
router.post('/add', function(req, res, next) {
    let url = req.body.url;        //图片地址
    let title = req.body.title;     //图片标题
    query("INSERT INTO photo (pic_title,pic_url) VALUES ('"+title+"','"+url+"')", [1], function(err,results,fields){ 
        res.send("1");
    });
});

//删除照片
router.post('/delete', function(req, res, next) {
    let id = req.body.id;  //照片id
    query("DELETE FROM photo WHERE pic_id="+id+"", [1], function(err,results,fields){  
        res.send("1");
    });
});

//编辑照片
router.post('/edit', function(req, res, next) {
    let id = req.body.id;  //照片id
    let url = req.body.url;        //图片地址
    let title = req.body.title;     //图片标题
    query("UPDATE photo SET pic_title='"+title+"',pic_url='"+url+"' WHERE pic_id="+id+"", [1], function(err,results,fields){
        res.send("1");
    });
});

module.exports = router;