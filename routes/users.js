var express = require('express');
var router = express.Router();

var query=require("./mysql_pool");  

// 登录
router.post('/login', function(req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  query("SELECT * FROM user WHERE username='"+username+"' AND password='"+password+"'", [1], function(err,results,fields){  
    res.send(results.length+'');
  });
});

// 修改密码
router.post('/change', function(req, res, next) {
  let oldPsd = req.body.oldPsd;
  let newPsd = req.body.newPsd;

  query("SELECT * FROM user WHERE username='admin' AND password='"+oldPsd+"'", [1], function(err,results,fields){
    // 如果查询成功
    if(results.length == 1){
      // 修改
      query("UPDATE user SET password='"+newPsd+"' WHERE username='admin'", [1], function(err,results,fields){
        // 修改密码成功
        if(results.affectedRows == 1 && !err){
          res.send("1");
        }else{
          res.send("0");
        }
      })
    }else{
      res.send("0");
    }  
  });
});

module.exports = router;
