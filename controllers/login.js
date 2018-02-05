var getData = require('../models/dbsql');
var crypto = require('crypto');
var log = require('../controllers/logControl');
var db = require("../models/db");
var async = require("async");
var permiss = require('../controllers/permissControl');
/**
 * 首页
 */
exports.index = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");       //跨域访问
    res.render('login');
};


/*
***注册：1为普通用户，2为旅级管理员
 */
exports.regist = function (req,res) {
    var body = req.body;
    try{
        var role_id = body.role_id || "";
        var name = body.name;
        var card_id = body.card_id;
        var show_pass = body.show_pass;
        var password = crypto.createHash('md5').update(body.show_pass).digest('hex');
        if(role_id =="" || name=="" || show_pass == ""){
            res.json({ "code": 300, "msg": "参数错误！" });
            return;
        }
        if(role_id==1){
            if(card_id==""){
                res.json({ "code": 300, "msg": { "status": "fail", "error": "证件号不能为空！" } });
                return;
            }
            getData.select_data("t_person",null,"name",name,"card_id",card_id,function (err,data) {
                if(err){
                    res.json({ "code": 300, "msg": "数据库查询失败！"});
                    return;
                }else{
                    if(data.length==0){
                        res.json({ "code": 400, "msg": { "status": "fail", "error": "姓名与证件号不符或不存在！" } });
                    }else{
                        getData.select_data("t_user",null,"name",name,"card_id",card_id,function (err,datas) {
                            if(err){
                                res.json({ "code": 301, "msg": "数据库查询失败！"});
                                return;
                            }else{
                                if(datas.length>0){
                                    res.json({ "code": 302, "msg": "用户已存在！" });
                                }else{
                                    var create_time = new Date().getTime();
                                    var tokens = card_id + "_" + "123456";
                                    var token = crypto.createHash("md5").update(tokens).digest('hex');
                                    var dataArr = ["name","card_id","show_pass","password","token","role_id","create_time"];
                                    var dataBrr = [name,card_id,show_pass,password,token,role_id,create_time];
                                    getData.into("t_user",dataArr,dataBrr,function (err,row) {
                                        if(err){
                                            res.json({ "code": 300, "msg": "数据库插入失败！"  });
                                            return;
                                        }else{
                                            log.insertLog(name,"用户管理","注册用户");
                                            res.json({ "code": 0, "msg": "注册成功" });
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            })
        }else if(role_id == 2){
            getData.select_data("t_user","count(0) as total","name",name,null,null,function (err,data) {
                if(err){
                    res.json({ "code": 300, "msg": "数据库查询失败！"});
                    return;
                }else {
                    if(data[0].total==1){
                        res.json({ "code": 302, "msg": "管理员用户已存在！" });
                    }else {
                        var create_time = new Date().getTime();
                        var dataArr = ["name","show_pass","password","role_id","create_time"];
                        var dataBrr = [name,show_pass,password,role_id,create_time];
                        getData.start("t_user",dataArr,dataBrr,function (err,row) {
                            if(err){
                                res.json({ "code": 300, "msg": "数据库插入失败！" });
                                return;
                            }else{
                                getData.start("t_unit",["pid","name"],[0,name],function (err,dates) {
                                    if(err ==0){
                                        log.insertLog(name,"用户管理","注册用户");
                                        res.json({ "code": 0, "msg": "注册成功" });
                                    }else{
                                        res.json({ "code": 301, "msg": "注册失败" });
                                    }
                                })

                            }
                        })
                    }
                }
            })
        }

    }catch (e){
        console.log(e);
        res.end(JSON.stringify({"code": 400, "msg": "未知错误！"}));
    }
}

/**
 * 用户登录
 * username 用户名
 * password 密码
 */
exports.userLogin = function (req,res) {
    var query = req.body;
    try {
        var role_id = query.role_id || "";
        var name=query.name||"";
        var card_id = query.card_id ||"";
        var show_pass = query.show_pass||-1;
        if (role_id=="" || name=="" || show_pass==-1 ) {
            res.json({ "code": 300, "msg": "参数错误" });
            return;
        }
        if(role_id==1){
            if(card_id==""){
                res.json({ "code": 300, "msg": "证件号不能为空！" });
                return;
            }
            var md5password = crypto.createHash('md5').update(show_pass).digest('hex');
            getData.select_data("t_user", null,"name",name ,"password",md5password,function (err, result) {
                if(err){
                    res.json({ "code": 301, "msg": "数据库查询失败！" });
                    return;
                }else{
                    if(result.length>0){
                        console.log(123);
                        console.log(result[0].card_id);
                        if(result[0].card_id ==card_id){
                            var timestamp = new Date().getTime();
                            var tokens = card_id + "_" + timestamp;
                            var token = crypto.createHash("md5").update(tokens).digest('hex');
                            getData.updata("t_user",["token=?,lastlogintime=?"],[token,timestamp],"name",name,function (err,date) {
                                if(err){
                                    res.json({ "code": 301, "msg":"数据库修改失败！" });
                                    return;
                                }else{
                                    getData.select_data("t_user",null,"name",name,"card_id",card_id,function (err,row) {
                                        if(err){
                                            res.json({ "code": 301, "msg":"数据库查询失败！" });
                                        }else{
                                            log.insertLog(name,"用户管理","用户登陆");
                                            res.json({ "code": 0, "msg": "登陆成功！","row":row });
                                        }
                                    })

                                }
                            })

                        }else{
                            res.json({ "code": 302, "msg":"用户名或证件号错误！" });
                        }
                    }else{
                        res.json({ "code": 303, "msg": "用户名或密码错误！" });
                    }
                }
            })

        }else if(role_id==2){
            var pass = crypto.createHash('md5').update(show_pass).digest('hex');
            getData.select_data("t_user","count(0) as total","name",name,"password",pass,function (err,data) {
                if(err){
                    console.log(err);
                    res.json({ "code": 301, "msg": "数据库查询失败！" });
                }else{
                    if(data[0].total==1){
                        var timestamp = new Date().getTime();
                        var tokens = card_id + "_" + timestamp;
                        var token = crypto.createHash("md5").update(tokens).digest('hex');
                        getData.updata("t_user",["token=?"],[token],"name",name,function (err,date) {
                            if (err) {
                                res.json({ "code": 301, "msg": { "status": "fail", "error": err.message }});
                                return;
                            } else {
                                getData.select_data("t_user",null,"name",name,null,null,function (err,result) {
                                    if(err){
                                        res.json({ "code": 302, "msg": "查询失败","error": err.message });
                                        return;
                                    }else{
                                        log.insertLog(name,"用户管理","用户登陆");
                                        res.json({ "code": 0, "msg": "登陆成功！","row":result});
                                    }
                                })
                            }
                        })
                    }else{
                        res.json({ "code": 304, "msg": "用户名或密码错误" });
                    }
                }
            })
        }

    } catch (e) {
        console.log(e);
        res.end(JSON.stringify({"code": 500, "msg": "未知错误！"}));
    }
}

/**
 * 退出登录
 * @param req
 * @param res
 * @param next
 */

exports.userLoginout = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");       //跨域访问
    var body = req.body;
    try{
        var user = body.user || -1;
        var token = body.token || -1;
        if(user ==-1 || token==-1){
            res.json({ "code": 100, "msg": "参数不全！" });
            return;
        }
        getData.updata("t_user",["token=?"],[0],"name",user,function (err,data) {
            if(err){
                res.json({ "code": 300, "msg": "token修改失败！" });
            }else{
                log.insertLog(user,"用户管理","用户退出");
                res.json({ "code": 0, "msg": "退出成功！"});
            }
        })
    } catch (e) {
        console.log(e)
        res.end(JSON.stringify({"code": 500, "msg": "未知错误！"}));
    }

};

// /**
//  * 修改密码
//  * @param req
//  * @param res
//  * @param next
//  */
// exports.updatePassword = function (req,res,next) {
//     res.setHeader("Access-Control-Allow-Origin","*");
//     var query = req.body;
//     console.log(query);
//     try {
//         var id = query.id;
//         var nPass = query.newPass;
//         var oPass = query.oldPass;
//         var oldPass = crypto.createHash('md5').update(oPass).digest('hex');
//         var newPass = crypto.createHash('md5').update(nPass).digest('hex');
//         getData.select_data("t_user",null,"id",id,"is_valid",1,function (err, result) {
//             if(result.length!=""){
//                 if(result[0].password ==newPass && result[0].show_pass ==nPass){
//                     res.end(JSON.stringify({"code": 301, "msg": "原密码与新密码相同"}));
//                     return;
//                 }
//                 if(result[0].password ==oldPass && result[0].show_pass ==oPass){
//                     getData.updata("t_user",["password=?","show_pass=?"],[newPass,nPass],"id",id,function (err,data) {
//                         if(data){
//
//                             res.end(JSON.stringify({"code": 0, "msg": "密码修改成功"}));
//                         }else{
//                             res.end(JSON.stringify({"code": 100, "msg": "密码修改失败"}));
//                         }
//                     })
//                 }else{
//                     res.end(JSON.stringify({"code": 302, "msg": "原密码不正确，不允许修改"}));
//                 }
//             }else{
//                 res.end(JSON.stringify({"code": 303, "msg": "该用户不存在!"}));
//             }
//         })
//
//     }catch (e){
//         console.log(e);
//         res.end(JSON.stringify({"code": 400, "msg": "未知错误！"}));
//     }
// }



/**
 * 增加修改人员
 * @param req
 * @param res
 * @param next
 */
exports.add_user = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    try {
        var id = query.id || -1;
        var user = query.user || -1;
        var token = query.token||-1;
        var card_id = query.card_id||-1;
        var role_id = query.role_id || -1;
        var nPass = query.password || -1;
        var email = query.email ||-1;
        var newPass = crypto.createHash('md5').update(nPass).digest('hex');
        var create_time =new Date().getTime();
        var dataArr = ["name","card_id","role_id","show_pass","password","email","create_time"];
        var dataBrr = [name,card_id,nPass,newPass,role_id,email,create_time];
        if(user==-1 ||token==-1|| role_id==-1 || nPass==-1){
            res.json({ "code": 300, "msg": { "status": "fail", "error": "参数错误" } });
            return;
        }
        permiss.checkMobile2Token(user,token,function (data) {
            if(data){
                if(role_id==1 &&card_id!=-1){
                    if(id==-1){
                        getData.select_data("t_user","count(0) as total","name",name,"password",newPass,function (err,data) {
                            if(err){
                                res.json({ "code": 301, "msg": { "status": "fail", "error": err.message } });
                                return;
                            }else{
                                if(data[0].total==1){
                                    res.end(JSON.stringify({"code": 302, "msg": "该用户已存在!"}));
                                }else{
                                    getData.data_add_modify("t_user",dataArr,dataBrr,null,null,function (err,rows) {
                                        if(err){
                                            res.json({ "code": 301, "msg": { "status": "fail", "error": err.message } });
                                            return;
                                        }else{
                                            log.insertLog(user,"人员管理","添加用户");
                                            res.json({ "code": 0, "msg": "添加成功！"});
                                        }
                                    })
                                }
                            }
                        })
                    }else{
                        getData.select_data("t_user","count(0) as total","id",id,null,null,function (err,data) {
                            if(err){
                                res.json({ "code": 301, "msg": { "status": "fail", "error": err.message } });
                                return;
                            }else{
                                if(data[0].total==0){
                                    res.json({"code": 302, "msg": "该用户不存在!"});
                                }else{
                                    getData.data_add_modify("t_user",dataArr,dataBrr,"id",id,function (err,rows) {
                                        if(err){
                                            res.json({ "code": 301, "msg": err.message });
                                            return;
                                        }else{
                                            log.insertLog(user,"人员管理","修改学员信息");
                                            res.json({ "code": 0, "msg": "修改成功"  });
                                        }
                                    })
                                }
                            }
                        })
                    }

                }else{
                    var dataCrr = ["name","role_id","show_pass","password","email","create_time"];
                    var dataDrr = [name,nPass,newPass,role_id,email,create_time];
                    if(id==-1){
                        getData.select_data("t_user","count(0) as total","name",username,"password",newPass,function (err,data) {
                            if(err){
                                res.json({ "code": 301, "msg": { "status": "fail", "error": err.message } });
                                return;
                            }else{
                                if(data[0].total==1){
                                    res.json({"code": 302, "msg": "该用户已存在!"});
                                }else{
                                    getData.data_add_modify("t_user",dataCrr,dataDrr,null,null,function (err,rows) {
                                        if(err){
                                            res.json({ "code": 301, "msg": err.message });
                                            return;
                                        }else{
                                            log.insertLog(user,"人员管理","添加学员");
                                            res.json({ "code": 0, "msg": "添加成功！" });
                                        }
                                    })
                                }
                            }
                        })
                    }else{
                        getData.select_data("t_user","count(0) as total","id",id,null,null,function (err,data) {
                            if(err){
                                res.json({ "code": 301, "msg": { "status": "fail", "error": err.message } });
                                return;
                            }else{
                                if(data[0].total==0){
                                    res.json({"code": 302, "msg": "该用户不存在!"});
                                }else{
                                    getData.data_add_modify("t_user",dataCrr,dataDrr,"id",id,function (err,rows) {
                                        if(err){
                                            res.json({ "code": 301, "msg": err.message  });
                                            return;
                                        }else{
                                            log.insertLog(user,"人员管理","修改学员信息");
                                            res.json({ "code": 0, "msg":  "修改成功"});
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            }else{
                res.json({"code":400,"msg":"用户与token不匹配"});
            }
        })

    }catch (e){
        console.log(e);
        res.json({"code": 500, "msg": "未知错误！"});
    }
}



/*
 ***删除用户或管理员
 */
exports.delete_user = function (req,res) {
    var body = req.body;
    try {
        var user = body.user || -1;
        var token = body.token || -1;
        if (user == -1 || token == -1) {
            res.json({"code": 100, "msg": "参数不全"});
            return;
        }
        permiss.checkMobile2Token(user, token, function (datas) {
            if (datas) {
                var id = JSON.parse(body.id) || -1;
                async.map(id, function (item, cb) {
                    getData.delete_data("t_user", null, "id", item, function (err, row) {
                        console.log(err);
                        cb(null, row);
                    })
                }, function (err, data) {
                    log.insertLog(user, "系统管理", "删除管理员或普通用户");
                    res.json({"code": 0, "msg": "删除成功"});
                })
            } else {
                res.json({"code": 400, "msg": "账号和token不匹配"});
            }
        })
    }catch (e){
        console.log(e);
        res.json({"code": 500, "msg": "未知错误！"});
    }
}
