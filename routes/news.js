var express = require('express');
var router = express.Router();

var query=require("./mysql_pool");  

// 增加新闻
router.post('/', function(req, res, next) {
    let title = req.body.title;        //评论内容
    let content = req.body.content;     //评论时间
    query("INSERT INTO news (news_title,news_content) VALUES ("+title+",'"+content+")", [1], function(err,results,fields){ 
        res.send("1");
    });
});

//查询新闻,可以接受限制的条件
router.post('/', function(req, res, next) {
    let limitNum = req.body.limit;
    let str = limitNum?" LIMIT "+limitNum:"";
    query("SELECT * FROM news"+str, [1], function(err,results,fields){  
        res.send(results);
    });
});

//删除新闻
router.post('/delete', function(req, res, next) {
    let id = req.body.id;  //新闻id
    query("DELETE FROM news WHERE news_id="+id+"", [1], function(err,results,fields){  
        res.send("1");
    });
});

// 编辑新闻
router.post('/', function(req, res, next) {
    let id =  req.body.id;    //新闻id
    let title = req.body.title;     //新闻标题
    let content = req.body.content;       //新闻内容
    query("UPDATE news SET news_title='"+title+"',news_content='"+content+"' WHERE news_id="+id+"", [1], function(err,results,fields){
        res.send("1");
    });
});

module.exports = router;