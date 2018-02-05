var express = require('express');
var path = require('path');
var http = require("http");
var bodyParser = require('body-parser');
var ejs = require('ejs');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var fs =require('fs');
//var ffi = require('ffi');
//var ref = require('ref');
var log = require('./log');
var logger = require('./log').logger;
var tester = require('./routes/bridge');


var app = express();

//log.use(app);
// view engine setup
app.set('views', path.join(__dirname, 'views'));

app.engine('.html',ejs.__express);
app.set('view engine', 'html');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use(express.static(path.join(__dirname, 'views')));
app.use("/module", express.static(path.join(__dirname, 'node_modules')));
var Glosession;
var zksession = require('./sessionHk.js').getSession;
zksession(app, function (session) {
    Glosession = session;
});

// 默认加载
app.use('/',tester);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    console.log('Hello everybody');
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});




module.exports = app;
