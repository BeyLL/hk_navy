var getData = require('../models/dbsql');                       //通用sql查询
var crypto = require('crypto');
var log = require('../controllers/logControl');
var async = require("async");
var db = require("../models/db");
var xlsx = require('node-xlsx');
var fs = require('fs');
var ejsExcel = require('ejsexcel');
var permiss = require('../controllers/permissControl');

/************************************计划或指示管理 start *************************************************/

/**
 * 添加计划或指示
 * @param req
 * @param res
 * @param next
 */
 exports.add_plan = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    try {
        var user = query.user ||-1;
        var token = query.token ||-1;
        if(user ==-1 || token==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }
        permiss.checkMobile2Token(user,token,function (data) {
            if(data){
                var plan_point = query.plan_point ||-1;
                var unit_id = query.unit_id || -1;
                var creater = query.creater ||-1;
                var title = query.title|| -1;
                var info = query.info || -1;
                var createtime = query.createtime ||new date().getTime();
                var is_push = query.is_push || 0;
                if(plan_point==-1||creater==-1|| title==-1||is_push==-1 ||unit_id==-1){
                    res.json({"code":101,"msg":"参数错误"});
                    return;
                }
                // var dataArr=[];
                var fileArr = ["unit_id","creater","title","info","createtime","plan_point","is_push"];
                // for(var i=0;i<unit_id.length;i++){
                //     var dataArrs = [unit_id[i],creater,title,info,createtime,plan_point,is_push];
                    var dataArr = [unit_id,creater,title,info,createtime,plan_point,is_push];
                //     dataArr.push(dataArrs);
                // }
                // console.log(dataArr);
                getData.into("t_pushPlan",fileArr,dataArr,function (err,data) {
                    if(err==0){
                        if(plan_point==1){
                            var bbq = "指示";
                        }else if(plan_point ==2){
                            var bbq = "计划";
                        }else if(plan_point ==3){
                            var bbq = "训练资料";
                        }
                        log.insertLog(user,"信息资料","添加"+bbq+"");
                        res.json({"code":0,"msg":"保存成功"});
                    }else {
                        res.json({"code":300,"msg":"保存失败"});
                    }
                })
            }else{
                res.json({"code":400,"msg":"账号与Token不匹配"});
            }
        })

    }catch (e){
        console.log(e);
        res.json({"code":200,"msg":"未知错误"});
    }
}

/**
 * 推送计划或指示
 * @param req
 * @param res
 * @param next
 */
exports.push_plan = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body||-1;
    var user = query.user||-1;
    var token = query.token||-1;
    try{
        if(user ==-1 || token==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }
        permiss.checkMobile2Token(user,token,function (data) {
            if(data){
                var id = query.id;
                if(id==-1){
                    res.json({"code":100,"msg":"参数错误"});
                    return;
                }
                flag =true;
                async.map(id,function(item,cb){
                    getData.updata("t_pushPlan","is_push=?",1,"id",item,function (err,data) {
                        if(err==0){
                            flag =true;
                            cb(0,data);
                        }else{
                            flag =false;
                            cb(err,0);
                        }
                    })

                },function (err,data) {
                    if(flag){
                        log.insertLog(user,"信息资料","推送指示或计划");
                        res.json({"code":0,"msg":"推送成功"});
                    }else{
                        res.json({"code":100,"msg":"推送失败"});
                    }
                })
            }else{
                res.json({"code":400,"msg":"账号与Token不匹配"});
            }
        })


    }catch(e){
        console.log(e);
        res.json({"code":200,"msg":"未知错误"});
    }
}

/**
 * 上级单位删除计划或指示
 * @param req
 * @param res
 * @param next
 */
exports.sup_delete_plan =function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user;
    var token = query.token;
    try{
        if(user ==-1 || token==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }
        permiss.checkMobile2Token(user,token,function (data) {
            if(data){
                var id = query.id;
                if( id==-1){
                    res.json({"code":100,"msg":"参数错误"});
                    return;
                }
                async.map(id,function(item,cb){
                    var sql = "delete from t_pushplan where id =?";
                    db.insert([item],sql,function (err,data) {
                        cb(null,item);
                    })
                },function (err,data) {
                    log.insertLog(user,"信息资料","删除指示或计划");
                    res.json({"code":0,"msg":"删除指示或计划成功","row":data});
                })
            }else{
                res.json({"code":400,"msg":"账号与Token不匹配"});
            }
        })

    }catch(e){
        console.log(e);
        res.json({"code":200,"msg":"unknow error"});
    }
}
/**
 * 根据Id批量或单个删除计划或指示
 * @param req
 * @param res
 * @param next
 */
exports.delete_plan =function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user ||-1;
    var token = query.token ||-1;
    try{
        if(user ==-1 || token==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }
        permiss.checkMobile2Token(user,token,function (data) {
            if(data){
                var id = JSON.parse(query.id)||-1;
                if( id==-1){
                    res.json({"code":100,"msg":"参数错误"});
                    return;
                }
                async.map(id,function(item,cb){
                    var sql =" delete from t_pushplan where id =?";
                    db.insert([item],sql,function (err,data) {
                        cb(null,item);
                    })
                },function (err,data) {
                        log.insertLog(user, "信息资料", "删除指示或计划");
                        res.json({"code": 0, "msg": "删除指示或计划成功"});
                })

            }else{
                res.json({"code":400,"msg":"账号与Token不匹配"});
            }
        })

    }catch(e){
        console.log(e);
        res.json({"code":200,"msg":"unknow error"});
    }
}
/**
 * 按单位分页获取指示推送
 * @param req
 * @param res
 * @param next
 */
exports.get_plan =function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    try{
        var user = body.user ||-1;
        var token = body.token ||-1;
        if(user ==-1 || token==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }
        permiss.checkMobile2Token(user,token,function (data) {
            if(data){
                var unit_id = body.unit_id || -1;
                var page = body.page ||-1;
                var pageSize = body.pageSize ||10;
                if(unit_id==-1){
                    res.json({"code":101,"msg":"参数错误"});
                    return;
                }
                if(unit_id==1){
                    getData.select_data("t_pushplan",null,null,null,null,null,function (err,data) {
                        if(err==0){
                            res.json({"code":0,"msg":"查询成功","row":data});
                            return;
                        }else{
                            res.json({"code":300,"msg":"数据库查询错误","row":err.message});
                        }
                    })
                }else{
                    getData.select_data("t_pushplan",null,"unit_id",unit_id,null,null,function (err,data) {
                        if(err==0){
                            res.json({"code":0,"msg":"查询成功","row":data});
                            return;
                        }else{
                            res.json({"code":300,"msg":"数据库查询错误","row":err.message});
                        }
                    })
                }

            }else{
                res.json({"code":400,"msg":"账号与Token不匹配"});
            }
        })

    }catch(e){
        console.log(e);
        res.json({"code":200,"msg":"未知错误"});
    }
}

/**
 * 根据ID获取指示推送URL
 * @param req
 * @param res
 * @param next
 */
exports.get_planUrl =function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    try{
        var user = body.user ||-1;
        var token = body.token ||-1;
        if(user ==-1 || token==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }
        permiss.checkMobile2Token(user,token,function (data) {
            if(data){
                var id = body.id || -1;
                if(id==-1){
                    res.json({"code":101,"msg":"参数错误"});
                    return;
                }
                getData.select_data("t_pushplan",null,"id",id,null,null,function (err,data){
                    if(err == 0){
                        res.json({"code":0,"msg":"查询成功","row":data[0]});
                    }else{
                        res.json({"code":300,"msg":"数据库查询错误","row":err.message});
                    }
                })
            }else{
                res.json({"code":400,"msg":"账号与Token不匹配"});
            }
        })


    }catch(e){
        console.log(e);
        res.json({"code":200,"msg":"未知错误"});
    }

}


/**
 * 编辑计划或指示
 * @param req
 * @param res
 * @param next
 */
exports.editplanUrl =function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    try{
        var user = body.user ||-1;
        var token = body.token ||-1;
        if(user ==-1 || token==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }
        permiss.checkMobile2Token(user,token,function (data) {
            if(data){
                var id = body.id || -1;
                var unit_id = body.unit_id || -1;
                var creater = body.creater ||-1;
                var title =body.title||-1;
                var info =body.info||"";
                var createtime =body.createtime || new Date().getTime();
                var plan_point =body.plan_point || -1;
                var is_push =body.is_push|| -1;
                if(id==-1 ||unit_id==-1 ||creater==-1||title==-1||plan_point==-1||is_push==-1){
                    res.json({"code":101,"msg":"参数错误"});
                    return;
                }
                getData.updata("t_pushplan",["unit_id=?","creater=?","title=?","info=?","createtime=?","plan_point=?","is_push=?"],[unit_id,creater,title,info,createtime,plan_point,is_push],"id",id,function (err,data){
                    if(err == 0){
                        res.json({"code":0,"msg":"修改成功","row":data[0]});
                    }else{
                        console.log(err.message);
                        res.json({"code":300,"msg":"修改失败","row":err.message});
                    }
                })
            }else{
                res.json({"code":400,"msg":"账号与Token不匹配"});
            }
        })


    }catch(e){
        console.log(e);
        res.json({"code":200,"msg":"未知错误"});
    }

}


/************************************计划或指示管理 end ***************************************************/

