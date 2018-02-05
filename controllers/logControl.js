var getData = require('../models/dbsql');
var permiss = require('../controllers/permissControl');

/**
 * 日志管理
 */
exports.insertLog = function (userName,type,operate) {
    var create_time = new Date().getTime();
    getData.into("t_log",["name,type,operate,create_time"],[userName,type,operate,create_time],function (err,data) {});
}


exports.getLog = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    var user = body.user || -1;
    var token = body.token || -1;
    try {
        if(user == -1 || token == -1){
            res.json({"code":300,"msg":"参数错误"});
        }else{
            permiss.checkMobile2Token(user,token,function (date) {
                if(date){
                    var d_filed = body.d_filed || "";
                    var data = body.data || -1;
                    var code = body .code || -1;
                    var lift = body.lift || -1;
                    var page = body.page || -1;
                    var pageSize = body .pageSize || 10;
                    if(code ==-1){
                        code ="create_time";
                    }
                    if(lift==-1){
                        lift ="desc";
                    }
                    getData.select_data_orderby("t_log",null,null,null,code,lift,null,null,function (err,datas) {
                        if(err){
                            res.json({"code":400,"msg":"数据查询错误"});
                        }else{
                            if(page == -1){
                                res.json({"code":0,"msg":"查询成功","total":datas.length,"data":datas});
                            }else{
                                if(page < 1){
                                    page = 1;
                                }
                                getData.select_data_orderby("t_log",null,d_filed,data,code,lift,page,pageSize,function (err,row) {
                                    if(err ==0){
                                        res.json({"code":0,"msg":"查询成功","total":datas.length,"data":row});
                                    }else{
                                        res.json({"code":400,"msg":"数据查询错误"});
                                    }
                                })
                            }
                        }
                    })
                }else{
                    res.json({"code":300,"msg":"账号和token不匹配"});
                }
            })
        }
    }catch (e){
        console.log(e);
        res.json({"code":200,"msg":"未知错误"});
    }
}