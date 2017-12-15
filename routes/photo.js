var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require("path");

var query=require("./mysql_pool");  



// 查照片
router.post('/', function(req, res, next) {
    let limitNum = req.body.limit;
    let currentPage = req.body.currentPage;
    // 当传了参数的就表示需要分页查询
    let str = limitNum?" LIMIT "+(currentPage-1)*limitNum+","+limitNum:"";
    let obj = {};
    query("SELECT count(*) FROM photo", [1], function(err,results,fields){ 
        obj.count = results[0]['count(*)'];   // 总条数
        query("SELECT * FROM photo"+str, [1], function(err,results,fields){
            obj.list = results
            res.send(obj);
        });
    });
});


//按照片的id查询
router.post('/id', function(req, res, next) {
    let id = req.body.id*1;
    if(id){
        query("SELECT * FROM photo WHERE pic_id="+id+"", [1], function(err,results,fields){
            res.send(results);
        });
    }else{
        res.send("0");
    }
});

//添加照片
router.post('/add', function(req, res, next) {
    let url = req.body.url;        //图片地址
    let title = req.body.title;     //图片标题
    let pic_name = req.body.pic_name //图片名称
    query("INSERT INTO photo (pic_title,pic_url,pic_name) VALUES ('"+title+"','"+url+"','"+pic_name+"')", [1], function(err,results,fields){ 
        if(results.affectedRows==1 && !err){
            res.send("1");
        }else{
            res.send("0");
        }
    });
});

//删除照片
router.post('/delete', function(req, res, next) {
    let id = req.body.id;  //照片id
    let pic_name = req.body.pic_name;  //数据库中的图片名称
    query("DELETE FROM photo WHERE pic_id="+id+"", [1], function(err,results,fields){ 
        if(!pic_name){
            if(results.affectedRows==1 && !err){
                res.send("1")
            }else{
                res.send("0");
            }
            return
        }
        var url = path.join(__dirname,"../public/static/img/" + pic_name);
            fs.unlink(url, (err) => {
                if(results.affectedRows==1 && !err){
                    res.send("1")
                }else{
                    res.send("0");
                }
            });
        });
});

//编辑照片
router.post('/edit', function(req, res, next) {
    let id = req.body.id;  //照片id
    let url = req.body.url;        //图片地址
    let title = req.body.title;     //图片标题
    let pic_name = req.body.pic_name; //图片名称
    query("UPDATE photo SET pic_title='"+title+"',pic_url='"+url+"',pic_name='"+pic_name+"' WHERE pic_id="+id+"", [1], function(err,results,fields){
        if(results.affectedRows==1 && !err){
            res.send("1");
        }else{
            res.send("0");
        }
    });
});

//把上传了的图片删除
router.post('/delete_pic', function(req, res, next) {
    try {
        let pic_name = req.body.pic_name;  //数据库中的图片名称
        if(pic_name){
            var url = path.join(__dirname,"../public/static/img/" + pic_name);
            fs.unlink(url, (err) => {
                if (err) throw err;
                res.send("1")
            });
        }else{
            res.send("no")
        }   
    } catch (error) {
        res.send("0");
    }
   
});

module.exports = router;