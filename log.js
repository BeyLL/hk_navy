var log4js = require('log4js');
var conf ={
  "appenders":[
      {
      "type":"file",
      "filename":"./logs/webServer.log",
      "maxLogSize":10485760,
      "backups":20,
      "category":"normal"
      },
      {"type":"console"}
  ]
};
log4js.configure(conf,{});
var logger = log4js.getLogger('normal');
exports.logger = logger;
exports.use = function(app){
    app.use(log4js.connectLogger(logger,{level:'debug',format:':method :url'}))
};
