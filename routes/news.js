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


function convertUTCTimeToLocalTime(UTCDateString) {
    if(!UTCDateString){
      return '-';
    }
    function formatFunc(str) {    //格式化显示
      return str > 9 ? str : '0' + str
    }
    var date2 = new Date(UTCDateString);     //这步是关键
    var year = date2.getFullYear();
    var mon = formatFunc(date2.getMonth() + 1);
    var day = formatFunc(date2.getDate());
    var hour = date2.getHours();
    // var noon = hour >= 12 ? 'PM' : 'AM';
    // hour = hour>=12?hour-12:hour;
    hour = formatFunc(hour);
    var min = formatFunc(date2.getMinutes());
    var dateStr = year+'-'+mon+'-'+day+'  '+hour+':'+min;
    return dateStr;
}

// 增加新闻
router.post('/add', function(req, res, next) {
    let title = req.body.title;        //新闻标题
    let content = req.body.content;     //新闻内容
    let date = req.body.date;   //新闻时间
    let plainText = req.body.plainText //纯文本
    let pic_name = req.body.pic_name; //图片名称
    let url = req.body.url;        //图片地址
    date = convertUTCTimeToLocalTime(date);
    query("INSERT INTO news (news_title,news_content,news_date,news_plainText,pic_name,pic_url) VALUES ('"+title+"','"+content+"','"+date+"','"+plainText+"','"+pic_name+"','"+url+"')", [1], function(err,results,fields){ 
        if(results.affectedRows==1 && !err){
            res.send("1");
        }else{
            res.send("0");
        }
    });
});

//查询新闻,可以接受限制的条件
router.post('/', function(req, res, next) {
    let limitNum = req.body.limit;
    let currentPage = req.body.currentPage;
    // 当传了参数的就表示需要分页查询
    let str = limitNum?" LIMIT "+(currentPage-1)*limitNum+","+limitNum:"";
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
    let id = req.body.id;  //新闻id
       
    query("DELETE FROM news WHERE news_id="+id+"", [1], function(err,results,fields){
        if(req.body.pic_name){
            let pic_name = req.body.pic_name;  //数据库中的图片名称
            var url = path.join(__dirname,"../public/static/img/" + pic_name);
            fs.unlink(url, (err) => {
                if(results.affectedRows==1 && !err){
                    res.send("1");
                }else{
                    res.send("0");
                }
            });
        }else{
            if(results.affectedRows==1 && !err){
                res.send("1");
            }else{
                res.send("0");
            }
        } 
    });
});

// 编辑新闻
router.post('/edit', function(req, res, next) {
    let id =  req.body.id;    //新闻id
    let title = req.body.title;        //新闻标题
    let content = req.body.content;     //新闻内容
    let date = req.body.date;   //新闻时间
    let plainText = req.body.plainText //纯文本
    let pic_name = req.body.pic_name; //图片名称
    let url = req.body.url;        //图片地址
    date = date.substr(0,10)+' '+date.substr(11,8);
    
    query("UPDATE news SET news_title='"+title+"',news_content='"+content+"',news_date='"+date+"',news_plainText='"+plainText+"',pic_name='"+pic_name+"',pic_url='"+url+"' WHERE news_id="+id+"", [1], function(err,results,fields){
        if(results.affectedRows==1 && !err){
            res.send("1");
        }else{
            res.send("0");
        }
    });
});
module.exports = router;