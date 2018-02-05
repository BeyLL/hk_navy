var express = require('express');
//解析cookie You need to use express.cookieParser() before app.router; middleware is run in order, meaning it’s never even reaching cookieParser() before your route is executed.
//解析cookie You need to use express.cookieParser() before app.router; middleware is run in order, meaning it’s never even reaching cookieParser() before your route is executed.
var cookieParser = require('cookie-parser');
var crypto = require('crypto');
//解析body
var bodyParser = require('body-parser');
//解析session
var session = require('express-session');
//存储session
var RedisStore = require('connect-redis')(session);

module.exports = {
	getSession:function(app,cb){
	//登陆中间件
	app.use(bodyParser.json());
	//设置session
	var options = {
			ttl: 60 * 60 * 24,
			host: "127.0.0.1",
			port: 6379,
			db:1
		};
	app.use(session({
		cookie: {maxAge: 60000 * 60 * 24}, // 20 minutes
		secret: "keyboard cat",
		store: new RedisStore(options),
		resave:true,
		saveUninitialized:true
	}));
	console.log("init Session sucessed");
	cb(session);
	}
}