var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require("path");

var query=require("./mysql_pool");  

// 查询所有作品
router.post('/', function(req, res, next) {
    let limitNum = req.body.limit;
    let currentPage = req.body.currentPage;
    // 当传了参数的就表示需要分页查询
    let str = limitNum?" LIMIT "+(currentPage-1)*limitNum+","+currentPage*limitNum:"";
    let obj = {};
    query("SELECT count(*) FROM works", [1], function(err,results,fields){ 
        obj.count = results[0]['count(*)'];   // 总条数
        query("SELECT * FROM works"+str, [1], function(err,results,fields){
            obj.list = results
            res.send(obj);
        });
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
    let id = req.body.id*1;
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
    let pic_name = req.body.pic_name; //图片名称
    // let id =  new Date().getTime(); //作品id
    query("INSERT INTO works (work_title,pic_url,work_type,home_show,view_count,pic_name) VALUES ('"+title+"','"+url+"','"+type+"','"+show+"',"+count+",'"+pic_name+"')", [1], function(err,results,fields){ 
       if(results){
            res.send("1");
       }else{
           res.send("0");
       }
        
    });
   
});

//作品删除
router.post('/delete', function(req, res, next) {
    let id = req.body.id;  //作品id
    query("DELETE FROM works WHERE work_id="+id+"", [1], function(err,results,fields){  
        // let limitNum = req.body.limit;
        // let currentPage = req.body.currentPage;
        // let str = limitNum?" LIMIT "+(currentPage-1)*limitNum+","+currentPage*limitNum:"";
        // let obj = {};
        // query("SELECT count(*) FROM works", [1], function(err,results,fields){ 
        //     obj.count = results[0]['count(*)'];   // 总条数
        //     query("SELECT * FROM works"+str, [1], function(err,results,fields){
        //         obj.list = results
        //         res.send(obj);
        //     });
        // });
       
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
    let pic_name = req.body.pic_name; //图片名称
    query("UPDATE works SET work_title='"+title+"',view_count='"+count+"',pic_url='"+url+"',work_type='"+type+"',home_show='"+show+"',pic_name='"+pic_name+"' WHERE work_id="+id+"", [1], function(err,results,fields){
        res.send("1");
    });
});


//把上传了的图片删除
router.post('/delete_pic', function(req, res, next) {
    let pic_name = req.body.pic_name;  //数据库中的图片名称
    let id =  req.body.id;    //作品id
    var url = path.join(__dirname,"../public/static/img/" + pic_name);
    fs.unlink(url, (err) => {
        if (err) throw err;
        //如果id存在，删除数据库中的图片url
        if(id){
            query("UPDATE works SET pic_url='' WHERE work_id="+id+"", [1], function(err,results,fields){
                res.send("1");
            });
        }else{
            res.send("1");
        }
    });
});

module.exports = router;
