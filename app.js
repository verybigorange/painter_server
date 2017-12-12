var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var proxy = require("http-proxy-middleware");

var index = require('./routes/index');
var users = require('./routes/users');
var works = require('./routes/works');
var comment = require('./routes/comment');
var photo = require('./routes/photo');
var news = require('./routes/news');
var upload = require('./routes/upload');

var app = express();

// 将所有请求地址中的api替换成空
app.use('/api', proxy({target: 'http://127.0.0.1:3000', changeOrigin: false,pathRewrite:{
  '^/api':''
}}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/works', works);
app.use('/comment', comment);
app.use('/photo', photo);
app.use('/news', news);
app.use('/upload', upload);

// 捕获错误
process.on('uncaughtException', function (err) {
  //打印出错误
  console.log(err);
  //打印出错误的调用栈方便调试
  console.log(err.stack);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
