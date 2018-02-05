var getData = require('../models/dbsql');                       //通用sql查询
var crypto = require('crypto');
var os=require('os');
var db = require("../models/db");
var log = require('../controllers/logControl');
var permiss = require('../controllers/permissControl');

/************************************获取本机IP和计算机名 start ******************************************/
/**
 * 获取本机IP和计算机名
 * @param req
 * @param res
 * @param next
 */
exports.local_info = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    try {
        if(user == -1 || token == -1){
            res.json({"code":300,"msg":"参数错误"})
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (date) {
                if(date){
                    var iptable={},
                        ifaces=os.networkInterfaces();
                    var hostname=os.hostname();
                    for (var dev in ifaces) {
                        ifaces[dev].forEach(function(details,alias){
                            if (details.family=='IPv6') {
                                iptable[dev+(alias?':'+alias:'')]=details.address;
                            }
                        });
                    }
                    var data=[iptable.本地连接,hostname];
                    res.json({"code":0,"msg":data});
                }else{
                    res.json({"code":300,"msg":"用户未登录"})
                }
            })
        }
    }catch (e){
        console.log(e);
        res.json({"code":200,"msg":"未知错误"});
    }
};

/************************************获取本机IP和计算机名 end ********************************************/

/************************************用户管理 start **********************************************/
/**
 * 分页获取用户
 * @param req
 * @param res
 */
exports.getUser = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    var user = body.user || -1;
    var token = body.token || -1;
    try{
        var page = body.page || -1;
        var pageSize = body.pageSize || 10;
        if(user == -1 || token == -1){
            res.json({"code":300,"msg":"参数错误"});
        }else{
            permiss.checkMobile2Token(user,token,function (date) {
                if(date){
                    getData.select_data("t_user",null,null,null,"is_valid",1,function (err,row) {
                        if(err==0){
                            if(page ==-1 ){
                                res.json({"code":0,"msg":"查询成功","total":row.length,"data":row});
                                return;
                            }else{
                                var start =parseInt((page - 1) *pageSize);
                                pageSize = parseInt(pageSize);
                                var sql = "select u.*,r.role_name from t_user u,t_role r where u.role_id = r.id and u.is_valid = 1 limit ?,?";
                                var dataArr = [start,pageSize];
                            }
                            db.insert(dataArr,sql,function (err,data) {
                                if(err ==0){
                                    res.json({"code":0,"msg":"查询成功","total":row.length,"data":data});
                                    return;
                                }else{
                                    res.json({"code":300,"msg":"查询失败"});
                                }
                            })
                        }else{
                            res.json({"code":301,"msg":"查询失败"});
                        }
                    })
                }else {
                    res.json({"code":300,"msg":"用户未登录"});
                }
            })
        }
    }catch (e){
        console.log(e);
        res.json({"code":200 , "msg":"未知错误"});
    }
};

/**
 * 添加/修改用户
 * @param req
 * @param res
 */
exports.addOrUser = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    try{
        var id = query.datas.id || -1;
        if(user == -1 || token == -1){
            res.json({"code":300,"msg":"参数错误"});
        }else{
            permiss.checkMobile2Token(user,token,function (date) {
                if(date){
                    if(id ==-1){
                        var fileArr = Object.keys(query.data);
                        var dataArr = [];
                        for(var i in query.data){
                            dataArr.push(query.data[i]);
                        }
                        getData.data_add_modify("t_user",fileArr,dataArr,null,null,function (err,data) {
                            if(data){
                                log.insertLog(user,"系统管理-用户管理","添加用户");
                                res.json({"code":0,"msg":"添加成功"});
                            }else {
                                console.log(err.message)
                                res.json({"code":100,"msg":"添加失败"});
                            }
                        })
                    }else{
                        var fileArr = Object.keys(query.data);
                        var dataArr = [];
                        for(var i in query.data){
                            dataArr.push(query.data[i]);
                        }
                        getData.data_add_modify("t_user",fileArr,dataArr,"id",id,function (err,data) {
                            if(data){
                                log.insertLog(user,"系统管理-用户管理","修改用户");
                                res.json({"code":0,"msg":"修改成功"});
                            }else {
                                console.log(err.message);
                                res.json({"code":100,"msg":"修改失败"});
                            }
                        })
                    }
                }else{
                    res.json({"code":300,"msg":"用户未登录"});
                }
            })
        }
    }catch (e){
        console.log(e);
        res.json({"code":200 , "msg":"未知错误"});
    }
};

/**
 * 删除用户
 * @param req
 * @param res
 */
exports.delUser = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    try{
        var id = query.id || -1;
        if(user == -1 || token == -1 || id ==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (date) {
                if(date){
                    getData.select_data("t_user",null,"id",id,null,null,function (err,data) {
                        if(err==0){
                            if(data.length>0){
                                var sql = "update t_user set is_valid=0 where id =?";
                                db.insert([id],sql,function (err,row) {
                                    if(err ==0){
                                        log.insertLog(user,"系统管理-用户管理","删除用户");
                                        res.json({"code":0,"msg":"删除成功"});
                                    }else{
                                        console.log(err.message);
                                        res.json({"code":300,"msg":"删除失败"});
                                        return;
                                    }
                                })
                            }else{
                                res.json({"code":301,"msg":"Id不存在"});
                                return;
                            }
                        }else{
                            console.log(err.message);
                            res.json({"code":302,"msg":"查询失败"});
                            return;
                        }
                    })
                }else{
                    res.json({"code":300,"msg":"用户未登录"});
                }
            })
        }
    }catch (e){
        console.log(e);
        res.json({"code":200 , "msg":"未知错误"});
    }
};

/**
 * 根据id获取用户信息
 * @param req
 * @param res
 */
exports.getSingleUser = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    var id = query.id || -1;
    try{
        if(user == -1 || token == -1 || id == -1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (date) {
                if(date){
                    var sql = "select u.*,r.role_name from t_user u, t_role r where u.role_id = r.id and u.id=?";
                    db.insert([id],sql,function (err,data) {
                        if(err){
                            res.json({"code":400,"msg":"数据查询错误"});
                        }else{
                            res.json({"code":0,"msg":"查询成功","data":data});
                        }
                    })
                }else{
                    res.json({"code":300,"msg":"账号和token不匹配"});
                }
            })
        }
    }catch (e){
        console.log(e);
        res.json({"code":200 , "msg":"未知错误"});
    }
}
/************************************人员系统参数设置 end ************************************************/

/************************************数据库备份/还原 start ***********************************************/

/**
 * 数据库备份
 * @param req
 * @param res
 * @param next
 */
exports.db_backup = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    var user = body.user || -1;
    var token = body.token || -1;
    try{
        if(user == -1 || token == -1){
            res.json({"code":300,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (date) {
                if(date){
                    var d = new Date();
                    var date = d.getFullYear()+"年"+(d.getMonth()+1)+"月"+d.getDate()+"日"+d.getHours()+"时"+d.getMinutes()+"分";
                    var cmd = "mysqldump -h 127.0.0.1 -P 3306 -uadmin -padmin hktrain > D:/backup/数据库备份_"+date+".sql";
                    exec(cmd,function (err,stdout,stderr) {
                        if(!err){
                            console.log("执行 ["+cmd+"] 成功");
                            log.insertLog(user,"系统管理","数据库备份");
                            return res.json({"code":0,"msg":"数据库备份成功"});
                        }else{
                            console.log(err);
                            return res.json({"code":100,"msg":"数据库备份失败"});
                        }
                    });
                }else{
                    res.json({"code":300,"msg":"用户未登录"});
                }
            })
        }
    }catch(e){
        console.log(e);
        res.json({"code":200,"msg":"未知错误"});
    }
}

/**
 * 数据库还原
 * @param req
 * @param res
 * @param next
 */
exports.db_restore = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    var user = body.user || -1;
    var token = body.token || -1;
    try{
        var path = req.body.path || -1;
        if(user == -1 || token == -1 || path == -1){
            return res.json({"code":300,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (date) {
                if(date){
                    var cmd = "mysql -h 127.0.0.1 -uadmin -padmin hktrain < "+path;
                    exec(cmd,function (err,stdout,stderr) {
                        if(!err){
                            console.log("执行 ["+cmd+"] 成功");
                            log.insertLog(user,"系统管理","数据库还原");
                            return res.json({"code":0,"msg":"数据库还原成功"});
                        }else{
                            console.log(err);
                            return res.json({"code":100,"msg":"数据库还原失败"});
                        }
                    });
                }else{
                    res.json({"code":300,"msg":"用户未登录"});
                }
            })
        }
    }catch(e){
        console.log(e);
        res.json({"code":200,"msg":"未知错误"});
    }
}
/************************************数据库备份/还原 end *************************************************/

/************************************单位管理 start *************************************************/

/**
 * 获取一级单位
 * @param req
 * @param res
 * @param next
 */
exports.getAllUnit = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    // var user = body.user || -1;
    // var token = body.token || -1;
    try{
        getData.select_data("t_unit",null,null,null,null,null,function (err,data) {
            if(err === 0){
                res.json({"code":0,"msg":"查询成功","row":data});
            }else{
                res.json({"code":300,"msg":"查询失败"});
            }
        })
        // if(user == -1 || token == -1){
        //     res.json({"code":100,"msg":"参数错误"});
        // }else{
        //     permiss.checkMobile2Token(user,token,function (date) {
        //         if(date){
        //             getData.select_data("t_unit",null,"pid",0,null,null,function (err,data) {
        //                 if(err === 0){
        //                     res.json({"code":0,"msg":"查询成功","row":data});
        //                 }else{
        //                     res.json({"code":300,"msg":"查询失败"});
        //                 }
        //             })
        //         }else{
        //             res.json({"code":300,"msg":"用户未登录"});
        //         }
        //     })
        // }
    }catch(e){
        console.log(e);
        res.json({"code":200,"msg":"未知错误"});
    }
};


/**
 * 获取一级单位
 * @param req
 * @param res
 * @param next
 */
exports.getUnit = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    // var user = body.user || -1;
    // var token = body.token || -1;
    try{
        getData.select_data("t_unit",null,"pid",0,null,null,function (err,data) {
            if(err === 0){
                res.json({"code":0,"msg":"查询成功","row":data});
            }else{
                res.json({"code":300,"msg":"查询失败"});
            }
        })
        // if(user == -1 || token == -1){
        //     res.json({"code":100,"msg":"参数错误"});
        // }else{
        //     permiss.checkMobile2Token(user,token,function (date) {
        //         if(date){
        //             getData.select_data("t_unit",null,"pid",0,null,null,function (err,data) {
        //                 if(err === 0){
        //                     res.json({"code":0,"msg":"查询成功","row":data});
        //                 }else{
        //                     res.json({"code":300,"msg":"查询失败"});
        //                 }
        //             })
        //         }else{
        //             res.json({"code":300,"msg":"用户未登录"});
        //         }
        //     })
        // }
    }catch(e){
        console.log(e);
        res.json({"code":200,"msg":"未知错误"});
    }
};

/**
 *根据父id获取二级单位
 * @param req
 * @param res
 * @param next
 */
exports.getfirstUnit = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    var user = body.user || -1;
    var token = body.token || -1;
    try{
        var pid = body.pid|| -1;
        if(pid ==-1){
            pid=0;
        }
        if(user == -1 || token == -1 || pid ==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (date) {
                if(date){
                    getData.select_data("t_unit",null,"pid",pid,null,null,function (err,data) {
                        if(err === 0){
                            res.json({"code":0,"msg":"查询成功","row":data});
                        }else{
                            res.json({"code":300,"msg":"查询失败"});
                        }
                    })
                }else{
                    res.json({"code":300,"msg":"用户未登录"});
                }
            })
        }
    }catch(e){
        console.log(e);
        res.json({"code":200,"msg":"未知错误"});
    }
};
/**
 *根据pid获取上级单位
 * @param req
 * @param res
 * @param next
 */
exports.getupUnit = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    var user = body.user || -1;
    var token = body.token || -1;
    try{
        var pid = body.pid|| -1;
        if(pid ==-1){
            pid=0;
        }
        if(user == -1 || token == -1 || pid ==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (date) {
                if(date){
                    getData.select_data("t_unit",null,"id",pid,null,null,function (err,data) {
                        if(err === 0){
                            res.json({"code":0,"msg":"查询成功","row":data});
                        }else{
                            res.json({"code":300,"msg":"查询失败"});
                        }
                    })
                }else{
                    res.json({"code":300,"msg":"用户未登录"});
                }
            })
        }
    }catch(e){
        console.log(e);
        res.json({"code":200,"msg":"未知错误"});
    }
};

/**
 * 增加修改单位
 * @param req
 * @param res
 * @param next
 */
exports.addUpdateUnit = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    var user = body.user || -1;
    var token = body.token || -1;
    try{
        var id = body.id || -1;
        var pid = body.pid|| 0;
        var name = body.name ||-1;
        if(user == -1 || token == -1 || name ==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (date) {
                if(date){
                    if(id ==-1){
                        var sql = "select count(0) as total from t_unit where name =?";
                        db.insert([name],sql,function (err,result) {
                            if(err==0){
                                if(result.length>0){
                                    res.json({"code":301,"msg":"此单位已存在！"});
                                }else{
                                    getData.data_add_modify("t_unit",["pid","name"],[pid,name],null,null,function (err,data) {
                                        if(err === 0){
                                            log.insertLog(user,"系统管理","添加单位");
                                            res.json({"code":0,"msg":"添加成功"});
                                        }else{
                                            res.json({"code":300,"msg":"添加失败"});
                                        }
                                    })
                                }
                            }else{
                                res.json({"code":302,"msg":"数据库查询失败"});
                            }
                        })
                    }else{
                        var sql = "select count(0) as total from t_unit where id =?";
                        db.insert([id],sql,function (err,result) {
                            if(err == 0){
                                if(result.length>0){
                                    getData.data_add_modify("t_unit",["pid","name"],[pid,name],"id",id,function (err,row) {
                                        if(err === 0){
                                            log.insertLog(user,"系统管理","修改单位");
                                            res.json({"code":0,"msg":"修改成功"});
                                        }else{
                                            res.json({"code":303,"msg":"修改失败"});
                                        }
                                    })
                                }else{
                                    res.json({"code":304,"msg":"此单位不存在！"});
                                }
                            }else{
                                res.json({"code":305,"msg":"数据库查询失败"});
                            }
                        })
                    }
                }else{
                    res.json({"code":300,"msg":"用户未登录"});
                }
            })
        }
    }catch(e){
        console.log(e);
        res.json({"code":200,"msg":"未知错误"});
    }
};


/**
 * 删除单位
 * @param req
 * @param res
 * @param next
 */
exports.delUnit = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    var user = body.user || -1;
    var token = body.token || -1;
    try{
        var id = body.id || -1;
        if(user == -1 || token == -1 || id ==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (date) {
                if(date){
                    getData.select_data("t_unit",null,"id",id,null,null,function (err,row) {
                        if(err ==0){
                            if(row.length>0){
                                var sql = "delete from t_unit where id =?";
                                db.insert([id],sql,function (err,data) {
                                    if(err ==0){
                                        log.insertLog(user,"系统管理","添加单位");
                                        res.json({"code":0,"msg":"删除成功"});
                                    }else{
                                        res.json({"code":300,"msg":"删除失败"});
                                    }
                                })
                            }else{
                                res.json({"code":301,"msg":"此单位不存在！"});
                            }
                        }else{
                            res.json({"code":302,"msg":"数据库查询错误"});
                        }
                    });
                }else{
                    res.json({"code":300,"msg":"用户未登录"});
                }
            })
        }
    }catch(e){
        console.log(e);
        res.json({"code":200,"msg":"未知错误"});
    }
};