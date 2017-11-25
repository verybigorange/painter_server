var express = require('express');
var router = express.Router();

var query=require("./mysql_pool");  

// 增加评论
router.post('/', function(req, res, next) {
    let id = req.body.id;      //作品id，为了关联作品
    let comment = req.body.comment;        //评论内容
    let date = req.body.date;     //评论时间
    query("INSERT INTO comment (work_id,comment,comment_date) VALUES ("+id+",'"+comment+"','"+date+"')", [1], function(err,results,fields){ 
        res.send("1");
    });
});

//查询作品评论
router.post('/', function(req, res, next) {
    let limitNum = req.body.limit;
    let str = limitNum?" LIMIT "+limitNum:"";
    let id =  req.body.id;    //作品id
    if(id){
        query("SELECT * FROM comment WHERE work_id="+id+""+str, [1], function(err,results,fields){  
            res.send(results);
        });
    }else{
        res.send("0");
    }
});

//删除作品评论
router.post('/delete', function(req, res, next) {
    let id = req.body.id;  //评论id
    query("DELETE FROM comment WHERE comment_id="+id+"", [1], function(err,results,fields){  
        res.send("1");
    });
});