/**
 * Created by WangLinJie on 2018/1/15.
 */
var getData = require('../models/dbsql');           //通用sql查询
var db = require('../models/db');
var log = require('../controllers/logControl');
var permiss = require('../controllers/permissControl');
var async = require('async');

/************************* 权限管理 ***********************************/

/**
 * 添加角色
 * @param req
 * @param res
 */
exports.add_role = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    var roleName= query.roleName || -1;
    var actions = query.actions;
    var create_time = new Date().getTime();
    try{
        if(roleName == -1 || user == -1 || token == -1) {
            res.json({"code":300,"msg":"参数错误"});
            return;
        }else {
            permiss.checkMobile2Token(user,token,function (date) {
                if(date){
                    getData.select_data("t_role",null,"role_name",roleName,null,null,function (err,result) {
                        if(err){
                            res.json({"code":200,"msg":"查询数据错误"});
                        }else{
                            if(result.length > 0){
                                res.json({"code":200,"msg":"该角色已存在"});
                            }else{
                                getData.into("t_role",["role_name ,create_time"],[roleName,create_time],function (err,results) {
                                    if(err){
                                        console.log(err.message);
                                        res.json({"code":400,"msg":"数据插入错误"});
                                    }else{
                                        getData.select_data("t_role","id","role_name",roleName,null,null,function (err,data) {
                                            if(err){
                                                res.json({"code":250,"msg":"查询数据错误"});
                                            }else{
                                                var s = [];
                                                if(actions.length > 0){
                                                    for(var i=0;i<actions.length;i++){
                                                        var d = [data[0].id,actions[i]];
                                                        s.push(d);
                                                    }
                                                    var falg = true;
                                                    async.map(s,function (item,call) {
                                                        var sql = "";
                                                        for(j=0;j<item.length;j++){
                                                            sql+= "?,";
                                                        }
                                                        sql = sql.substring(0,sql.length-1);
                                                        db.insert(item,"insert into t_role_action (role_id, action_id) value ("+sql+")",function (err,datas) {
                                                            if(err){
                                                                falg = false;
                                                                call(null,item);
                                                            }else{
                                                               call(null,item);
                                                            }
                                                        })
                                                    },function (err,dates) {
                                                        if(!falg){
                                                            return res.json({"code":450,"msg":"数据插入错误"});
                                                        }else{
                                                            log.insertLog(user,"系统管理","添加角色");
                                                            return res.json({"code":0,"msg":"添加成功"});
                                                        }
                                                    })
                                                }else{
                                                    log.insertLog(user,"系统管理","添加角色");
                                                    res.json({"code":0,"msg":"添加成功"});
                                                }
                                            }
                                        })
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
        res.json({"code":300,"msg":"未知错误"});
    }
}

/**
 * 修改角色
 * @param req
 * @param res
 */
exports.edit_role = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    var id = query.id || -1;
    var roleName= query.roleName || -1;
    var actions = query.actions;
    try{
        if(user == -1 || token == -1 || id == -1 || roleName == -1){
            res.json({"code":300,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (date) {
                if(date){
                    getData.updata("t_role","role_name=?",roleName,"id",id,function (err,data) {
                        if(err){
                            console.log(err.message);
                            res.json({"code":400,"msg":"数据修改错误"});
                        }else{
                            getData.delete_data("t_role_action",null,"role_id",id,function (err,datas) {
                                if(err){
                                    res.json({"code":400,"msg":"数据删除错误"});
                                }else{
                                    var s = [];
                                    if(actions.length > 0){
                                        for(var i=0;i<actions.length;i++){
                                            var d = [id,actions[i]];
                                            s.push(d);
                                        }
                                        var falg = true;
                                        async.map(s,function (item,call) {
                                            var sql = "";
                                            for(j=0;j<item.length;j++){
                                                sql+= "?,";
                                            }
                                            sql = sql.substring(0,sql.length-1);
                                            db.insert(item,"insert into t_role_action (role_id, action_id) value ("+sql+")",function (err,datas) {
                                                if(err){
                                                    falg = false;
                                                    call(null,item);
                                                }else{
                                                    call(null,item);
                                                }
                                            })
                                        },function (err,dates) {
                                            if(!falg){
                                                return res.json({"code":450,"msg":"数据插入错误"});
                                            }else{
                                                log.insertLog(user,"系统管理","修改角色");
                                                return res.json({"code":0,"msg":"修改成功"});
                                            }
                                        })
                                    }else{
                                        log.insertLog(user,"系统管理","修改角色");
                                        res.json({"code":0,"msg":"修改成功"});
                                    }
                                }
                            })
                        }
                    })
                }else{
                    res.json({"code":300,"msg":"账号和token不匹配"});
                }
            })
        }
    }catch(e){
        console.log(e);
        res.json({"code":300,"msg":"未知错误"});
    }
}

/**
 * 删除角色
 * @param req
 * @param res
 */
exports.del_role = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    var id = query.id || -1;
    try{
        if(user == -1 || token == -1 || id == -1){
            res.json({"code":300,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (date) {
                if(date){
                    getData.select_data("t_role_action",null,"role_id",id,null,null,function(err,date) {
                        if(err){
                            return res.json({"code":400,"msg":"数据查询错误"});
                        }else{
                            if(date.length > 0){
                                getData.delete_data("t_role_action",null,"role_id",id,function (err,data) {
                                    if(err){
                                        return res.json({"code":400,"msg":"数据删除错误"});
                                    }else{
                                        getData.delete_data("t_role",null,"id",id,function (err,result) {
                                            if(err){
                                                return res.json({"code":450,"msg":"数据删除错误"});
                                            }else{
                                                log.insertLog(user,"系统管理","删除角色");
                                                return res.json({"code":0,"msg":"删除成功"});
                                            }
                                        })
                                    }
                                })
                            }else{
                                getData.delete_data("t_role",null,"id",id,function (err,result) {
                                    if(err){
                                        return res.json({"code":450,"msg":"数据删除错误"});
                                    }else{
                                        log.insertLog(user,"系统管理","删除角色");
                                        return res.json({"code":0,"msg":"删除成功"});
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
    }catch(e){
        console.log(e);
        res.json({"code":300,"msg":"未知错误"});
    }
}

/**
 * 获取所有权限
 * @param req
 * @param res
 */
exports.getAction = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    try{
        if(user == -1 || token == -1){
            res.json({"code":300,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (date) {
                if(date){
                    var sql = "select * from t_action where id not in (8)"
                    db.insert(null,sql,function (err,result) {
                        if(err){
                            res.json({"code":450,"msg":"数据查询错误"});
                        }else{
                            res.json({"code":0,"msg":"查询成功","data":result});
                        }
                    })
                }else{
                    res.json({"code":300,"msg":"账号和token不匹配"});
                }
            })
        }
    }catch(e){
        console.log(e);
        res.json({"code":300,"msg":"未知错误"});
    }
}

/**
 * 获取所有角色
 * @param req
 * @param res
 */
exports.getRole = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    var page = query.page || -1;
    var pageSize = query.pageSize || 10;
    try{
        if(user == -1 || token == -1){
            res.json({"code":300,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (date) {
                if(date){
                    var sql = "select * from t_role"
                    db.insert(null,sql,function (err,result) {
                        if(err){
                            res.json({"code":400,"msg":"数据查询错误"});
                        }else{
                            if(page == -1){
                                res.json({"code":0,"msg":"查询成功","total":result.length,"data":result});
                            }else{
                                if(page < 1){
                                    page = 1;
                                }
                                var sql = "select * from t_role limit ?,?"
                                page = (page - 1)*pageSize;
                                db.insert([parseInt(page),parseInt(pageSize)],sql,function (err,data) {
                                    if(err){
                                        console.log(err);
                                        res.json({"code":450,"msg":"数据查询错误"});
                                    }else{
                                        res.json({"code":0,"msg":"查询成功","total":result.length,"data":data});
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
    }catch(e){
        console.log(e);
        res.json({"code":300,"msg":"未知错误"});
    }
}

/**
 * 根据角色获取权限
 * @param req
 * @param res
 */
exports.getRoleAction = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    var role_id = query.id || -1
    try{
        if(user == -1 || token == -1 || role_id == -1){
            res.json({"code":300,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (date) {
                if(date){
                    var sql = "select a.* from t_role r, t_action a ,t_role_action ra where a.id = ra.action_id and r.id = ra.role_id and r.id=?"
                    db.insert([role_id],sql,function (err,result) {
                        if(err){
                            res.json({"code":450,"msg":"数据查询错误"});
                        }else{
                            res.json({"code":0,"msg":"查询成功","data":result});
                        }
                    })
                }else{
                    res.json({"code":300,"msg":"账号和token不匹配"});
                }
            })
        }
    }catch(e){
        console.log(e);
        res.json({"code":300,"msg":"未知错误"});
    }
}

