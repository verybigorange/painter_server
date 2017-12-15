var express = require('express');
var router = express.Router();

var query=require("./mysql_pool");  

var getNowFormatDate = require('../lib/getNowFormatDate.js')

// 增加评论
router.post('/add', function(req, res, next) {
    let id = req.body.id;      //作品id，为了关联作品
    let comment = req.body.comment;        //评论内容
    let date = getNowFormatDate();     //评论时间
    query("INSERT INTO comment (work_id,comment,comment_date) VALUES ("+id+",'"+comment+"','"+date+"')", [1], function(err,results,fields){
        let obj = {};
        obj["comment"] = comment;
        obj["comment_date"] = date;
        if(!err && results.affectedRows==1){
            res.send(obj);
        } else{
            res.send("0");
        }
    });
});



// 查询作品评论
router.post('/', function(req, res, next) {
    let limitNum = req.body.limit;
    let currentPage = req.body.currentPage;
    let work_id = req.body.work_id;
    // 当传了参数的就表示需要分页查询
    let str = limitNum?" LIMIT "+(currentPage-1)*limitNum+","+limitNum:"";
    let obj = {};
    query("SELECT count(*) FROM comment WHERE work_id="+work_id, [1], function(err,results,fields){ 
        obj.count = results[0]['count(*)'];   // 总条数
        query("SELECT * FROM comment WHERE work_id="+work_id+str, [1], function(err,results,fields){
            obj.list = results.reverse();
            res.send(obj);
        });
    });
});

//删除作品评论
router.post('/delete', function(req, res, next) {
    let comment_id = req.body.comment_id;  //评论id
    query("DELETE FROM comment WHERE comment_id="+comment_id+"", [1], function(err,results,fields){
        if(results.affectedRows==1 && !err){
            res.send("1");
        }else{
            res.send("0");
        }
        
    });
});

//删除作品的全部评论
router.post('/deleteAll', function(req, res, next) {
    let work_id = req.body.work_id;  //评论id
    query("DELETE FROM comment WHERE work_id="+work_id+"", [1], function(err,results,fields){
        if(results.affectedRows>=1 && !err){
            res.send("1");
        }else{
            res.send("0");
        }
    });
});

module.exports = router;