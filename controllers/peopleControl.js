var getData = require('../models/dbsql');                       //通用sql查询
var log = require('../controllers/logControl');
var db = require("../models/db");
var async = require("async");
var permiss = require('../controllers/permissControl');

/************************************人员管理 start ***********************************************/

/**
 * 分页获取人员列表
 * @param req
 * @param res
 * @param next
 */
exports.getPeople = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    var user = body.user || -1;
    var token = body.token || -1;
    var unit_first = body.unit_first || -1;
    var unit_second =body.unit_second ||-1;
    if(user==-1 || token ==-1 ){
        res.json({"code":100,"msg":"参数错误"});
        return;
    }
    try {
        permiss.checkMobile2Token(user,token,function (data) {
            if (data) {
                var page = body.page || -1;
                var pageSize = body.pageSize || 10;
                getData.select_data("t_person_attr",null, "is_show", 1, null, null, function (err, row) {
                    if (err == 0) {
                        var dataArr = [];
                        for (var i = 0; i < row.length; i++) {
                            dataArr.push(row[i].attrName);
                        }
                        if(unit_first==1||(unit_first==-1 && unit_second==-1)){
                                getData.select_data_orderby("t_person", dataArr, null, null, null, null, page, pageSize, function (err, data) {
                                    if (err) {
                                        console.log(err.message);
                                        res.json({"code": 301, "msg": "查询失败"});
                                    } else {
                                        var sql = "select * from t_person";
                                        db.insert(null,sql,function (err,result) {
                                            if(err){
                                                res.json({"code": 304, "msg": "数据查询错误"});
                                            }else{
                                                var sqls = "select * from t_unit";
                                                db.insert(null,sqls,function (err,date) {
                                                    if (err) {
                                                        res.json({"code": 304, "msg": "数据查询错误"});
                                                    } else {
                                                        for (var i = 0; i < data.length; i++) {
                                                            for (var j = 0; j < date.length; j++) {
                                                                if (data[i].unit_first == date[j].id) {
                                                                    data[i].unit_first = date[j].name;
                                                                }
                                                                if (data[i].unit_second == date[j].id) {
                                                                    data[i].unit_second = date[j].name;
                                                                }
                                                            }
                                                        }
                                                        res.json({"code": 0, "msg": "查询成功","total":result.length,"data": data,"row":row});
                                                    }
                                                })
                                            }
                                        })

                                    }
                                })
                        }else if(unit_first!=-1&&unit_second==-1){
                            getData.select_data_orderby("t_person", dataArr, ["unit_first"], [unit_first], null,null,page, pageSize, function (err, data) {
                                if (err) {
                                    console.log(err.message);
                                    res.json({"code": 301, "msg": "查询失败"});
                                } else {
                                    var sql = "select * from t_person";
                                    db.insert(null,sql,function (err,result) {
                                        if(err){
                                            res.json({"code": 304, "msg": "数据查询错误"});
                                        }else{
                                            var sqls = "select * from t_unit";
                                            db.insert(null,sqls,function (err,date) {
                                                if (err) {
                                                    res.json({"code": 304, "msg": "数据查询错误"});
                                                } else {
                                                    for (var i = 0; i < data.length; i++) {
                                                        for (var j = 0; j < date.length; j++) {
                                                            if (data[i].unit_first == date[j].id) {
                                                                data[i].unit_first = date[j].name;
                                                            }
                                                            if (data[i].unit_second == date[j].id) {
                                                                data[i].unit_second = date[j].name;
                                                            }
                                                        }
                                                    }
                                                    res.json({"code": 0, "msg": "查询成功","total":result.length,"data": data,"row":row});
                                                }
                                            })
                                        }
                                    })

                                }
                            })
                        }else if(unit_first == -1 && unit_second!=-1){
                            getData.select_data_orderby("t_person", dataArr, ["unit_second"], [unit_second],null,null,page, pageSize, function (err, data) {
                                if (err) {
                                    console.log(err.message);
                                    res.json({"code": 301, "msg": "查询失败"});
                                } else {
                                    var sql = "select * from t_person";
                                    db.insert(null,sql,function (err,result) {
                                        if(err){
                                            res.json({"code": 304, "msg": "数据查询错误"});
                                        }else{
                                            var sqls = "select * from t_unit";
                                            db.insert(null,sqls,function (err,date) {
                                                if (err) {
                                                    res.json({"code": 304, "msg": "数据查询错误"});
                                                } else {
                                                    for (var i = 0; i < data.length; i++) {
                                                        for (var j = 0; j < date.length; j++) {
                                                            if (data[i].unit_first == date[j].id) {
                                                                data[i].unit_first = date[j].name;
                                                            }
                                                            if (data[i].unit_second == date[j].id) {
                                                                data[i].unit_second = date[j].name;
                                                            }
                                                        }
                                                    }
                                                    res.json({"code": 0, "msg": "查询成功","total":result.length,"data": data,"row":row});
                                                }
                                            })
                                        }
                                    })

                                }
                            })
                        }else if(unit_first!=-1 && unit_second!=-1){
                            var sql = "select * from t_person where unit_first =? and unit_second=?";
                            if(page >= 1){
                                page = (page - 1)*pageSize;
                                sql += " limit " +  page + ","+pageSize
                            }
                            db.insert([unit_first,unit_second],sql,function (err,data) {
                                if(err ==0){
                                    getData.select_data("t_person",null,null,null,null,null,function (err,result) {
                                        if(err==0){
                                            var sqls = "select * from t_unit";
                                            db.insert(null,sqls,function (err,date) {
                                                if(err==0){
                                                    for (var i = 0; i < data.length; i++) {
                                                        for (var j = 0; j < date.length; j++) {
                                                            if (data[i].unit_first == date[j].id) {
                                                                data[i].unit_first = date[j].name;
                                                            }
                                                            if (data[i].unit_second == date[j].id) {
                                                                data[i].unit_second = date[j].name;
                                                            }
                                                        }
                                                    }
                                                    res.json({"code": 0, "msg": "查询成功","total":result.length,"data": data,"row":row});
                                                }else{
                                                    res.json({"code": 300, "msg": "数据库查询错误"});
                                                }
                                            })

                                        }else{
                                            res.json({"code": 301, "msg": "数据库查询错误"});
                                        }

                                    })
                                }else{
                                    res.json({"code": 302, "msg": "数据库查询错误"});
                                }
                            })

                        }
                    } else {
                        res.json({"code": 301, "msg": "查询失败"});
                    }
                })
            }else {
                res.json({"code":400,"msg":"账号与Token不匹配"});
            }
        })
    }catch (e){
        res.json({"code":200,"msg":"未知错误"});
    }
};

/**
 * 增根据ID获取人员信息
 * @param req
 * @param res
 * @param next
 */
exports.getPeopleId = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    var user = body.user||-1;
    var token = body.token|| -1;
    var id = body.id || -1;
    try {
        if(user ==-1 || token ==-1 || id ==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }
        permiss.checkMobile2Token(user,token,function (data) {
            if (data) {
                getData.select_data("t_person", null, "id", id, null,null, function (err, data) {
                    if (err==0) {
                        var sql = "select * from t_unit";
                        db.insert(null,sql,function (err,row) {
                            if(err==0){
                                res.json({"code": 0, "msg": "查询成功","row":data[0],"data":row});
                            }else{
                                res.json({"code": 200, "msg": "查询失败"});
                            }
                        })
                    } else {
                        res.json({"code": 201, "msg": "查询失败"});
                    }
                })
            }else{
                res.json({"code":400,"msg":"账号与Token不匹配"});
            }
        })
    }catch (e){
        res.json({"code":200,"msg":"unknow error"});
    }
};

/**
 * 增加人员
 * @param req
 * @param res
 * @param next
 */
exports.add_people = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    var user = body.user||-1;
    var token = body.token|| -1;
    try {
        if(user ==-1 || token ==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }
        permiss.checkMobile2Token(user,token,function (data) {
            if (data) {
                var fileArr = Object.keys(body.data);
                var dataArr = [];
                for (var i in body.data) {
                    dataArr.push(body.data[i]);
                }
                getData.data_add_modify("t_person", fileArr, dataArr, null, null, function (err, data) {
                    if (data) {
                        log.insertLog(user, "人员管理", "新增人员");
                        res.json({"code": 0, "msg": "保存成功"});
                    } else {
                        console.log(err);
                        res.json({"code": 300, "msg": "保存失败"});
                    }
                })
            }else{
                res.json({"code":400,"msg":"账号与Token不匹配"});
            }
        })
    }catch (e){
        res.json({"code":200,"msg":"unknow error"});
    }
};

/**
 * 修改人员
 * @param req
 * @param res
 * @param next
 */
exports.update_people = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    var user = body.user||-1;
    var token = body.token|| -1;
    try {
        if(user ==-1 || token ==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }
        permiss.checkMobile2Token(user,token,function (data) {
            if (data) {
                var id = body.id ||-1;
                var fileArr = Object.keys(body.data);
                var dataArr = [];
                for (var i in body.data) {
                    dataArr.push(body.data[i]);
                }
                if (id ==-1) {
                    res.json({"code":100,"msg":"参数不全"});
                    return;
                }
                getData.data_add_modify("t_person", fileArr, dataArr, "id", id, function (err, data) {
                    if (err==0) {
                        log.insertLog(user, "人员管理", "编辑人员");
                        res.json({"code": 0, "msg": "修改成功"});
                    } else {
                        console.log(err);
                        res.json({"code": 200, "msg": "修改失败"});
                    }
                })
            }else{
                res.json({"code":400,"msg":"账号与Token不匹配"});
            }
        })
    }catch (e){
        res.json({"code":300,"msg":"unknow error"});
    }
}

/**
 * 删除人员
 * @param req
 * @param res
 * @param next
 */
exports.delete_people = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    var user = body.user||-1;
    var token = body.token|| -1;
    try {
        if(user ==-1 || token ==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }
        permiss.checkMobile2Token(user,token,function (data) {
            if (data) {
                var id = JSON.parse(body.id);
                if (id.length<0) {
                    res.redirect('back');
                    return;
                }
                async.map(id,function(item,call){
                    getData.delete_data("t_person", null,"id", item, function (err, data) {
                        call(null,item);
                    })
                },function (err,data) {
                    log.insertLog(user, "人员管理", "删除人员");
                    res.json({"code": 0, "msg": "删除成功"});
                });
            }else{
                res.json({"code":400,"msg":"账号与Token不匹配"});
            }
        })
    }catch (e){
        res.json({"code":300,"msg":"unknow error"});
    }
};



/**
 *获取人员表字段属性
 * @param req
 * @param res
 * @param next
 */
exports.getPeopleAttr = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    var user = body.user||-1;
    var token = body.token|| -1;
    try {
        if(user ==-1 || token ==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }
        permiss.checkMobile2Token(user,token,function (data) {
            if (data) {
                var sql = "select * from t_person_attr";
                db.insert(null, sql, function (err, data) {
                    if (err === 0) {
                        res.json({"code": 0, "msg": "查询成功", "row": data});
                    } else {
                        res.json({"code": 300, "msg": "查询错误"});
                    }
                })
            }else{
                res.json({"code":400,"msg":"账号与Token不匹配"});
            }
        })
    }catch (e){
        res.json({"code":200,"msg":"未知错误"});
    }
};


/**
 *获取人员类别
 * @param req
 * @param res
 * @param next
 */
exports.getPeopleType = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    var user = body.user||-1;
    var token = body.token|| -1;
    try {
        if(user ==-1 || token ==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }
        permiss.checkMobile2Token(user,token,function (data) {
            if (data) {
                var sql = "select * from t_person_attr where id > 5 and id < 21";
                db.insert(null, sql, function (err, data) {
                    if (err === 0) {
                        res.json({"code": 0, "msg": "查询成功", "row": data});
                    } else {
                        res.json({"code": 300, "msg": "查询错误"});
                    }
                })
            }else{
                res.json({"code":400,"msg":"账号与Token不匹配"});
            }
        })
    }catch (e){
        res.json({"code":200,"msg":"未知错误"});
    }
};
/**
 *修改属性是否显示
 * @param req
 * @param res
 * @param next
 */
exports.updateAttr = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    var user = body.user||-1;
    var token = body.token|| -1;
    try {
        if(user ==-1 || token ==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }
        permiss.checkMobile2Token(user,token,function (data) {
            if (data) {
                var id = body.id;
                var sql = "update t_person_attr set is_show where id =?";
                db.insert([id], sql, function (err, data) {
                    if (err === 0) {
                        log.insertLog(user, "人员管理", "修改展示属性");
                        res.json({"code": 0, "msg": "修改成功", "row": data});
                    } else {
                        res.json({"code": 300, "msg": "查询错误"});
                    }
                })
            }else {
                res.json({"code":400,"msg":"账号与Token不匹配"});
            }
        })
    }catch (e){
        res.json({"code":200,"msg":"未知错误"});
    }
};

/**
 *增加人员表字段属性
 * @param req
 * @param res
 * @param next
 */
exports.addPeopleAttr = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    var user = body.user||-1;
    var token = body.token|| -1;
    try {
        if(user ==-1 || token ==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }
        permiss.checkMobile2Token(user,token,function (data) {
            if (data) {
                var attrName = body.attrName || -1;
                var attrValue = body.attrValue || -1;
                var is_show = parseInt(body.is_show) || -1;
                if (attrName == -1 || attrValue == -1 || is_show == -1) {
                    res.json({"code": 100, "msg": "参数错误"});
                }
                var sql = "select * from t_person_attr where attrName =? ";
                db.insert([attrName], sql, function (err, data) {
                    if (err === 0) {
                        if (data.length > 0) {
                            res.json({"code": 200, "msg": "此字段已存在"});
                        } else {
                            getData.into("t_person_attr", ["attrName", "attrValue", "is_show"], ["?,?,?"], function (err, row) {
                                if (err == 0) {
                                    log.insertLog(user, "人员管理", "新增人员属性");
                                    res.json({"code": 0, "msg": "添加成功"});
                                } else {
                                    console.log(err.message);
                                    res.json({"code": 330, "msg": "添加失败"});
                                }
                            })
                        }
                    } else {
                        console.log(err.message);
                        res.json({"code": 300, "msg": "查询错误"});
                    }
                })
            }else {
                res.json({"code":400,"msg":"账号与Token不匹配"});
            }
        })
    }catch (e){
        res.json({"code":200,"msg":"未知错误"});
    }
};

/**
 *删除人员表字段属性
 * @param req
 * @param res
 * @param next
 */
exports.deletePeopleAttr = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    var user = body.user||-1;
    var token = body.token|| -1;
    try {
        if(user ==-1 || token ==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }
        permiss.checkMobile2Token(user,token,function (data) {
            if (data) {
                var id = body.id || -1;
                var attrName = body.attrName || -1;
                if (id == -1 || attrName == -1) {
                    res.json({"code": 100, "msg": "参数错误"});
                }
                var ids = [1, 6, 7];
                if (ids.indexOf(id) != -1) {
                    res.json({"code": 303, "msg": "此字段不能删除"});
                }
                getData.select_data("t_person_attr", null, "id", id, "attrName", attrName, function (err, data) {
                    if (err == 0) {
                        if (data.length > 0) {
                            var sql = "delete from t_person_attr where id = ?";
                            db.insert([id], sql, function (err, data) {
                                if (err === 0) {
                                    var sqls = "ALTER TABLE t_person DROP COLUMN " + attrName;
                                    db.insert([], sqls, function (err, row) {
                                        if (err == 0) {
                                            log.insertLog(user, "人员管理", "删除人员属性");
                                            res.json({"code": 0, "msg": "删除成功"});
                                        } else {
                                            res.json({"code": 301, "msg": "删除失败"});
                                        }
                                    })
                                } else {
                                    res.json({"code": 302, "msg": "数据库错误"});
                                }
                            })
                        } else {
                            res.json({"code": 303, "msg": "此字段不存在"});
                        }
                    } else {
                        res.json({"code": 304, "msg": "查询错误"});
                    }
                })
            }else {
                res.json({"code":400,"msg":"账号与Token不匹配"});
            }
        })
    }catch (e){
        res.json({"code":200,"msg":"未知错误"});
    }
};

/**
 *编辑人员表字段属性
 * @param req
 * @param res
 * @param next
 */
exports.editPeopleAttr = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    var user = body.user||-1;
    var token = body.token|| -1;
    try {
        if(user ==-1 || token ==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }
        permiss.checkMobile2Token(user,token,function (data) {
            if (data) {
                var id = body.id || -1;
                var attrName = body.attrName || -1;
                var attrValue = body.attrValue || -1;
                var is_show = parseInt(body.is_show) || -1;
                if (id == -1 || attrName == -1 || attrValue == -1 || is_show == -1) {
                    res.json({"code": 100, "msg": "参数错误"});
                }
                getData.select_data("t_person_attr", null, "id", id, null, null, function (err, row) {
                    if (err == 0) {
                        if (row.length > 0) {
                            var old_attrName = row[0].attrName;
                            var sql = "select * from t_person_attr where attrName = ? and attrName not in(?)";
                            db.insert([attrName, attrName], sql, function (err, data) {
                                if (err === 0) {
                                    if (data.length == 0) {
                                        getData.updata("t_person_attr", ["attrName =?,attrValue=?,is_show =?"], [attrName, attrValue, is_show], "id", id, function (err, row) {
                                            if (err == 0) {
                                                var ids = [1, 6, 7];
                                                if (ids.indexOf(id) != -1) {
                                                    res.json({"code": 303, "msg": "此字段不能删除"});
                                                    return;
                                                }
                                                // alert table ?  change  old new char(50);

                                                var sqls = "alter table t_person change " + old_attrName + " " + attrName + " varchar(200)";
                                                db.insert(null, sqls, function (err, datas) {
                                                    if (err == 0) {
                                                        log.insertLog(user, "人员管理", "修改人员属性");
                                                        res.json({"code": 0, "msg": "修改成功"});
                                                    } else {
                                                        res.json({"code": 310, "msg": "修改失败"});
                                                    }
                                                })
                                            } else {
                                                res.json({"code": 300, "msg": "修改失败"});
                                            }
                                        })

                                    } else {
                                        res.json({"code": 300, "msg": "字段名已存在"});
                                        return;
                                    }

                                } else {
                                    res.json({"code": 301, "msg": "查询错误"});
                                    return;
                                }
                            })
                        } else {
                            res.json({"code": 303, "msg": "字段名不存在"});
                            return;
                        }

                    } else {
                        res.json({"code": 301, "msg": "查询错误"});
                    }
                })
            }else {
                res.json({"code":400,"msg":"账号与Token不匹配"});
            }
        })
    }catch (e){
        res.json({"code":200,"msg":"未知错误"});
    }
};


/**
 *按单位展示人员图表
 * @param req
 * @param res
 * @param next
 */
exports.chart_show = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    var user = body.user||-1;
    var token = body.token|| -1;
    try {
        if(user ==-1 || token ==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }
        permiss.checkMobile2Token(user,token,function (data) {
            if (data) {
                var unit = body.unit || -1;
                if (unit == -1) {
                    var sql = "select * from t_person";
                    var dataArr = [];
                } else {
                    var sql = "select * from t_person where unit =?";
                    var dataArr = [unit];
                }
                db.insert(dataArr, sql, function (err, data) {
                    if (err === 0) {

                        res.json({"code": 0, "msg": "查询成功", "row": data});
                    } else {
                        res.json({"code": 300, "msg": "查询错误"});
                    }
                })
            }else{
                res.json({"code":400,"msg":"账号与Token不匹配"});
            }
        })
    }catch (e){
        res.json({"code":200,"msg":"未知错误"});
    }
};
/************************************人员管理 end ***********************************************/

