var express = require('express');
var router = express.Router();

var query=require("./mysql_pool");  

// 查询所有作品
router.post('/', function(req, res, next) {
    let limitNum = req.body.limit;
    let str = limitNum?" LIMIT "+limitNum:"";
  query("SELECT * FROM works"+str, [1], function(err,results,fields){  
    res.send(results);
  });
});


// 按类型查询
router.post('/type', function(req, res, next) {
    let limitNum = req.body.limit;
    let str = limitNum?" LIMIT "+limitNum:"";
    let type = req.body.type;
    if(type){
        query("SELECT * FROM works WHERE work_type='"+type+"'"+str, [1], function(err,results,fields){  
            res.send(results);
        });
    }else{
        res.send("0");
    }
});

//按作品id查询
router.post('/id', function(req, res, next) {
    let id = req.body.id;
    if(id){
        query("SELECT * FROM works WHERE work_id="+id+"", [1], function(err,results,fields){  
            res.send(results);
        });
    }else{
        res.send("0");
    }
});

//按首页展示查询
router.post('/show', function(req, res, next) {
    query("SELECT * FROM works WHERE home_show='1'", [1], function(err,results,fields){  
        res.send(results);
    });
});

//作品添加
router.post('/add', function(req, res, next) {
    let type = req.body.type;      //类型
    let url = req.body.url;        //图片地址
    let title = req.body.title;     //图片标题
    let show = req.body.show;       //是否首页展示该作品
    let count =  req.body.count;    //作品浏览量
    query("INSERT INTO works (work_title,pic_url,work_type,home_show,view_count) VALUES ('"+title+"','"+url+"','"+type+"','"+show+"','"+count+"')", [1], function(err,results,fields){ 
        res.send("1");
    });
   
});

//作品删除
router.post('/delete', function(req, res, next) {
    let id = req.body.id;  //作品id
    query("DELETE FROM works WHERE work_id="+id+"", [1], function(err,results,fields){  
        res.send("1");
    });
});

//作品编辑
router.post('/edit', function(req, res, next) {
    let id =  req.body.id;    //作品id
    let type = req.body.type;  //类型
    let url = req.body.url;     //图片地址
    let title = req.body.title;     //图片标题
    let show = req.body.show;       //是否首页展示该作品
    let count =  req.body.count;    //作品浏览量
    query("UPDATE works SET work_title='"+title+"',view_count='"+count+"',pic_url='"+url+"',work_type='"+type+"',home_show='"+show+"' WHERE work_id="+id+"", [1], function(err,results,fields){
        res.send("1");
    });
});



