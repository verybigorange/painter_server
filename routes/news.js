var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');
var query=require("./mysql_pool");  
var ueditor = require("../lib/index.js");



router.use("/ue", ueditor(path.join(__dirname, '../public'), function (req, res, next) {
    console.log(path.join(__dirname, 'public'))
    //客户端上传文件设置
    var imgDir = '/static/img/'
     var ActionType = req.query.action;
    if (ActionType === 'uploadimage' || ActionType === 'uploadfile' || ActionType === 'uploadvideo') {
        var file_url = imgDir;//默认图片上传地址
        /*其他上传格式的地址*/
        if (ActionType === 'uploadfile') {
            file_url = '/static/file/'; //附件
        }
        if (ActionType === 'uploadvideo') {
            file_url = '/static/video'; //视频
        }

        res.ue_up(file_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
        res.setHeader('Content-Type', 'text/html');
      
    }
    //  客户端发起图片列表请求
    else if (req.query.action === 'listimage') {
        var dir_url = '/api/static/img/';
        res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }
    // 客户端发起其它请求
    else {
        // console.log('config.json')
        res.setHeader('Content-Type', 'application/json');
        res.redirect('/api/static/UE/nodejs/config.json');
    }
}));


// 增加新闻
router.post('/add', function(req, res, next) {
    let title = req.body.title;        //新闻标题
    let content = req.body.content;     //新闻内容
    let date = req.body.date;   //新闻时间
    let plainText = req.body.plainText //纯文本
    date = date.substr(0,10)+' '+date.substr(11,8);
    query("INSERT INTO news (news_title,news_content,news_date,news_plainText) VALUES ('"+title+"','"+content+"','"+date+"','"+plainText+"')", [1], function(err,results,fields){ 
        res.send("1");
    });
});

//查询新闻,可以接受限制的条件
router.post('/', function(req, res, next) {
    let limitNum = req.body.limit;
    let currentPage = req.body.currentPage;
    // 当传了参数的就表示需要分页查询
    let str = limitNum?" LIMIT "+(currentPage-1)*limitNum+","+currentPage*limitNum:"";
    let obj = {};
    query("SELECT count(*) FROM news", [1], function(err,results,fields){ 
        obj.count = results[0]['count(*)'];   // 总条数
        query("SELECT * FROM news"+str, [1], function(err,results,fields){
            obj.list = results
            res.send(obj);
        });
    });
});


//按新闻id查询
router.post('/id', function(req, res, next) {
    let id = req.body.id*1;
    if(id){
        query("SELECT * FROM news WHERE news_id="+id+"", [1], function(err,results,fields){
            res.send(results);
        });
    }else{
        res.send("0");
    }
});

//删除新闻
router.post('/delete', function(req, res, next) {
    let id = req.body.id;  //作品id
    query("DELETE FROM news WHERE news_id="+id+"", [1], function(err,results,fields){  
        res.send("1")
    });
});

// 编辑新闻
router.post('/edit', function(req, res, next) {
    let id =  req.body.id;    //新闻id
    let title = req.body.title;        //新闻标题
    let content = req.body.content;     //新闻内容
    let date = req.body.date;   //新闻时间
    let plainText = req.body.plainText //纯文本
    date = date.substr(0,10)+' '+date.substr(11,8);
    query("UPDATE news SET news_title='"+title+"',news_content='"+content+"',news_date='"+date+"',news_plainText='"+plainText+"' WHERE news_id="+id+"", [1], function(err,results,fields){
        res.send("1");
    });
});
module.exports = router;