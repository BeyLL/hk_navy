var getData = require('../models/dbsql');                   //通用sql查询
var db = require('../models/db');
var permiss = require('../controllers/permissControl');
var uploadBaseURL = require('../models/pathCionfig');
var log = require('../controllers/logControl');
var upload = require('../controllers/file');
var fs = require("fs");

/************************* 考核管理 ***********************************/

/**
 * 添加项目
 * @param req
 * @param res
 */
exports.add_project = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    var projectName = query.projectName || -1;
    var projectWeight = query.projectWeight || -1;
    var createTime = new Date().getTime();
    try{
        if(user == -1 || token == -1 || projectName == -1 || projectWeight ==  -1){
            res.json({"code":300,"msg":"参数错误"});
        }else{
            permiss.checkMobile2Token(user,token,function (data) {
                if(data){
                    var sql ="select * from t_project where name=? and name not in (?)";
                    db.insert([projectName,projectName],sql,function (err,datas) {
                        if(err){
                            res.json({"code":400,"msg":"数据查询错误"});
                        }else {
                            if(datas.length > 0){
                                res.json({"code":300,"msg":"该项目已存在"});
                            }else{
                                getData.into("t_project",["name,project_weight,create_time"],[projectName,projectWeight,createTime],function (err,result) {
                                    if(err){
                                        res.json({"code":400,"msg":"数据插入错误"});
                                    }else{
                                        log.insertLog(user,"考核管理","添加项目");
                                        res.json({"code":0,"msg":"添加成功"});
                                    }
                                })
                            }
                        }
                    })
                }else{
                    res.json({"code":300,"msg":"用户未登录"});
                }
            })
        }
    }catch (e){
        console.log(e);
        res.json({"code":300,"msg":"未知错误"});
    }
}

/**
 * 修改项目
 * @param req
 * @param res
 */
exports.edit_project = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    var id = query.id || -1;
    var projectName = query.projectName || -1;
    var projectWeight = query.projectWeight || -1;
    try{
        if(user == -1 || token == -1 || id == -1 || projectName == -1 || projectWeight == -1){
            res.json({"code":300,"msg":"参数错误"});
        }else{
            permiss.checkMobile2Token(user,token,function (data) {
                if(data){
                    var sql ="select * from t_project where name=? and name not in (?)";
                    db.insert([projectName,projectName],sql,function (err,datas) {
                        if(err){
                            res.json({"code":400,"msg":"数据查询错误"});
                        }else{
                            if(datas.length > 0){
                                res.json({"code":300,"msg":"该项目已存在！"});
                            }else{
                                getData.updata("t_project",["name=?,project_weight=?"],[projectName,projectWeight],"id",id,function (err,data) {
                                    if(err){
                                        res.json({"code":400,"msg":"数据修改错误"});
                                    }else{
                                        log.insertLog(user,"考核管理","修改项目");
                                        res.json({"code":0,"msg":"修改成功"});
                                    }
                                })
                            }
                        }
                    })
                }else{
                    res.json({"code":300,"msg":"用户未登录"});
                }
            })
        }
    }catch(e){
        console.log(e);
        res.json({"code":300,"msg":"未知错误"});
    }
}

/**
 * 删除项目
 * @param req
 * @param res
 */
exports.del_project = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    var id = query.id || -1;
    try{
        if(user == -1 || token == -1 || id == -1){
            res.json({"code":300,"msg":"参数错误"});
        }else{
            permiss.checkMobile2Token(user,token,function (data) {
                if(data){
                    getData.delete_data("t_subject",null,"project_id",id,function (err,date) {
                        if(err){
                            res.json({"code":310,"msg":"数据删除错误"});
                        }else{
                            getData.delete_data("t_project",null,"id",id,function (err,data) {
                                if(err){
                                    res.json({"code":400,"msg":"数据删除错误"});
                                }else{
                                    log.insertLog(user,"考核管理","删除项目");
                                    res.json({"code":0,"msg":"删除成功"});
                                }
                            })
                        }
                    })
                }else{
                    res.json({"code":300,"msg":"用户未登录"});
                }
            })
        }
    }catch(e){
        console.log(e);
        res.json({"code":300,"msg":"未知错误"});
    }
}

/**
 * 分页查询项目
 * @param req
 * @param res
 */
exports.get_project = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    var page = parseInt(query.page) || -1;
    var pageSize = parseInt(query.pageSize) || 10;
    try{
        if(user == -1 || token == -1){
            res.json({"code":300,"msg":"参数错误"});
        }else{
            permiss.checkMobile2Token(user,token,function (data) {
                if(data){
                    getData.select_data_orderby("t_project",null,null,null,"id","desc",null,null,function (err,date) {
                        if(err){
                            res.json({"code":400,"msg":"数据查询错误"});
                        }else{
                            if(page == -1){
                                res.json({"code":0,"msg":"查询成功","total":date.length,"data":date});
                            }else{
                                if(page < 1){
                                    page = 1;
                                }
                                getData.select_data_orderby("t_project",null,null,null,"id","desc",page,pageSize,function (err,result) {
                                    if(err){
                                        res.json({"code":400,"msg":"数据查询错误"});
                                    }else{
                                        res.json({"code":0,"msg":"查询成功","total":date.length,"data":result});
                                    }
                                })
                            }
                        }
                    })
                }else{
                    res.json({"code":300,"msg":"用户未登录"});
                }
            })
        }
    }catch(e){
        console.log(e);
        res.json({"code":300,"msg":"未知错误"});
    }
}

/**
 * 添加科目
 * @param req
 * @param res
 */
exports.add_subject = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    var projectId = query.projectId || -1;
    var subjectName = query.subjectName || -1;
    var subjectWeight = query.subjectWeight || -1;
    var createTime = new Date().getTime();
    try {
        if(user == -1 || token == -1 || projectId == -1 || subjectName == -1 || subjectWeight == -1){
            res.json({"code":300,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (data) {
                if(data){
                    var sql ="select * from t_subject where name=? and project_id=? and name not in (?)";
                    db.insert([subjectName,projectId,subjectName],sql,function (err,datas) {
                        if(err){
                            res.json({"code":400,"msg":"数据查询错误"});
                        }else {
                            if(datas.length > 0){
                                res.json({"code":300,"msg":"该科目已存在"});
                            }else{
                                getData.into("t_subject",["project_id,name,subject_weight,create_time"],[projectId,subjectName,subjectWeight,createTime],function (err,result) {
                                    if(err){
                                        res.json({"code":400,"msg":"数据插入错误"});
                                    }else{
                                        log.insertLog(user,"考核管理","添加科目");
                                        res.json({"code":0,"msg":"添加成功"});
                                    }
                                })
                            }
                        }
                    })
                }else{
                    res.json({"code":300,"msg":"用户未登录"});
                }
            })
        }
    }catch (e){
        console.log(e);
        res.json({"code":300,"msg":"未知错误"});
    }
}

/**
 * 修改科目
 * @param req
 * @param res
 */
exports.edit_subject = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    var id = query.id || -1;
    var projectId = query.projectId || -1;
    var subjectName = query.subjectName || -1;
    var subjectWeight = query.subjectWeight || -1;
    var test_time = query.test_time;
    try{
        if(user == -1 || token == -1 || id == -1 || projectId == -1 || subjectName == -1 || subjectWeight == -1){
            res.json({"code":300,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (data) {
                if(data){
                    var sql ="select * from t_subject where name=? and project_id=? and name not in (?)";
                    db.insert([subjectName,projectId,subjectName],sql,function (err,datas) {
                        if(err){
                            res.json({"code":400,"msg":"数据查询错误"});
                        }else{
                            if(datas.length > 0){
                                res.json({"code":300,"msg":"该科目已存在！"});
                            }else{
                                getData.updata("t_subject",["project_id=?,name=?,subject_weight=?,test_time=?"],[projectId,subjectName,subjectWeight,test_time],"id",id,function (err,data) {
                                    if(err){
                                        res.json({"code":400,"msg":"数据修改错误"});
                                    }else{
                                        log.insertLog(user,"考核管理","修改科目");
                                        res.json({"code":0,"msg":"修改成功"});
                                    }
                                })
                            }
                        }
                    })
                }else{
                    res.json({"code":300,"msg":"用户未登录"});
                }
            })
        }
    }catch(e){
        console.log(e);
        res.json({"code":300,"msg":"未知错误"});
    }
}

/**
 * 删除科目
 * @param req
 * @param res
 */
exports.del_subject = function (req,res) {
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
            permiss.checkMobile2Token(user,token,function (data) {
                if(data){
                    getData.delete_data("t_subject",null,"id",id,function (err,data) {
                        if(err){
                            res.json({"code":400,"msg":"数据删除错误"});
                        }else{
                            log.insertLog(user,"考核管理","删除科目");
                            res.json({"code":0,"msg":"删除成功"});
                        }
                    })
                }else{
                    res.json({"code":300,"msg":"用户未登录"});
                }
            })
        }
    }catch(e){
        res.json({"code":300,"msg":"未知错误"});
    }
}

/**
 * 根据项目id获取科目
 * @param req
 * @param res
 */
exports.get_subject = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    var projectId = query.projectId || -1;
    try{
        if(user == -1 || token == -1 || projectId == -1){
            res.json({"code":300,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (data) {
                if(data){
                    getData.select_data("t_subject",null,"project_id",projectId,null,null,function (err,date) {
                        if(err){
                            res.json({"code":400,"msg":"数据查询错误"});
                        }else{
                            res.json({"code":0,"msg":"查询成功","data":date});
                        }
                    })
                }else{
                    res.json({"code":300,"msg":"用户未登录"});
                }
            })
        }
    }catch(e){
        console.log(e);
        res.json({"code":300,"msg":"未知错误"});
    }
}

/**
 * 添加试题
 * @param req
 * @param res
 */
exports.add_examinfo = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    var subject_id = query.subject_id || -1;
    var title = query.fileName || -1;
    var create_time = new Date().getTime();
    var path = query.path || -1;
    try{
        if(user == -1 || token == -1 || subject_id == -1 || title == -1 || path == -1){
            res.json({"code":300,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (data) {
                if(data){
                    var fieldArr = ["subject_id","title","info_url","creator","create_time"];
                    var dataArr = [subject_id,title,path,user,create_time];
                    getData.into("t_examinfo",fieldArr,dataArr,function (err,date) {
                        if(err){
                            res.json({"code":400,"msg":"数据插入错误"});
                        }else{
                            log.insertLog(user,"远程考核","添加试题");
                            res.json({"code":0,"msg":"添加成功"});
                        }
                    })
                }else{
                    res.json({"code":300,"msg":"用户未登录"});
                }
            })
        }
    }catch(e){
        console.log(e);
        res.json({"code":300,"msg":"未知错误"});
    }
}

/**
 * 修改试题
 * @param req
 * @param res
 */
exports.edit_examinfo = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    var id= query.id || -1;
    var subject_id = query.subject_id || -1;
    var title = query.fileName || -1;
    var path = query.path || -1;
    try{
        if(user == -1 || token == -1 || id == -1 || subject_id == -1 || title == -1 || path == -1){
            res.json({"code":300,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (data) {
                if(data){
                    var sql = "select * from t_examinfo where title=? and subject_id=? and title not in (?)";
                    getData.select_data("t_examinfo",null,"title",title,"subject_id",subject_id,function (err,datas) {
                        if(err){
                            res.json({"code":400,"msg":"数据查询错误"});
                        }else{
                            if(datas.length > 0 ){
                                res.json({"code":200,"msg":"该题已存在"});
                            }else{
                                var fieldArr = ["subject_id=?","title=?","info_url=?","creator=?"];
                                var dataArr = [subject_id,title,path,user];
                                getData.updata("t_examinfo",fieldArr,dataArr,"id",id,function (err,date) {
                                    if(err){
                                        res.json({"code":400,"msg":"数据修改错误"});
                                    }else{
                                        log.insertLog(user,"远程考核","修改试题");
                                        res.json({"code":0,"msg":"修改成功"});
                                    }
                                })
                            }
                        }
                    })
                }else{
                    res.json({"code":300,"msg":"用户未登录"});
                }
            })
        }
    }catch(e){
        console.log(e);
        res.json({"code":300,"msg":"未知错误"});
    }
}

/**
 * 删除试题
 * @param req
 * @param res
 */
exports.del_examinfo = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    var id= query.id || -1;
    var path = query.path || -1;
    try{
        if(user == -1 || token == -1 || id == -1 || path == -1){
            res.json({"code":300,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (data) {
                if(data){
                    fs.unlinkSync(path);
                    getData.delete_data("t_examinfo",null,"id",id,function (err,datas) {
                        if(err){
                            res.json({"code":400,"msg":"数据删除错误"});
                        }else{
                            log.insertLog(user,"远程考核","删除试题");
                            res.json({"code":0,"msg":"删除成功"});
                        }
                    })
                }else{
                    res.json({"code":300,"msg":"用户未登录"});
                }
            })
        }
    }catch(e){
        console.log(e);
        res.json({"code":300,"msg":"未知错误"});
    }
}

/**
 * 下载试题
 * @param req
 * @param res
 */
exports.down_examinfo = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    var paths = query.path || -1;
    //var url = "/"+uploadBaseURL+"/g"
    var path = paths.replace(/http:\/\/127.0.0.1:8081/g, '../public')
    var postfix = path.split(".")[path.split(".").length - 1];
    //var fileName = path.split(".")[path.split(".").length - 2];
    var fileName="123123";
    try{
        if(user == -1 || token == -1 || path == -1){
            res.json({"code":300,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (data) {
                if(data){
                    // var buffer = fs.readFileSync(path);
                    // console.log(buffer);
                    // res.setHeader('Content-Type','application/vnd.openxmlformats');
                    // res.setHeader('Content-Disposition','attachment;filename='+encodeURI(fileName)+'.'+postfix);
                    // res.write(buffer,'binary');
                    // res.end();
                    res.download(path);
                }else{
                    res.json({"code":300,"msg":"用户未登录"});
                }
            })
        }
    }catch(e){
        console.log(e);
        res.json({"code":300,"msg":"未知错误"});
    }
}

/**
 * 添加想定
 * @param req
 * @param res
 */
exports.add_scenario = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    var unit_id= query.unit_id || -1;
    var title = query.title || -1;
    var content = query.content || -1;
    var create_time = new Date().getTime();
    var path = query.path || "";
    var fileName = query.fileName || "";
    try{
        if(user == -1 || token == -1 || unit_id == -1 || title == -1 || content == -1){
            res.json({"code":300,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (data) {
                var filedArr = ["unit_id,title,content,option_name,option_url,creator,create_time,is_release"];
                var dataArr = [unit_id,title,content,fileName,path,user,create_time,0];
                if(data){
                    getData.into("t_scenario",filedArr,dataArr,function(err,data) {
                        if(err){
                            res.json({"code":400,"msg":"数据插入错误"});
                        }else{
                            log.insertLog(user,"远程考核","添加想定");
                            res.json({"code":0,"msg":"添加成功"});
                        }
                    })
                }else{
                    res.json({"code":300,"msg":"用户未登录"});
                }
            })
        }
    }catch(e){
        console.log(e);
        res.json({"code":300,"msg":"未知错误"});
    }
}

/**
 * 修改想定
 * @param req
 * @param res
 */
exports.edit_scenario = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    var id= query.id || -1;
    var unit_id= query.unit_id || -1;
    var title = query.title || -1;
    var content = query.content || -1;
    var path = query.path || "";
    var fileName = query.fileName || "";
    try{
        if(user == -1 || token == -1 || id == -1 || unit_id == -1 || title == -1 || content == -1){
            res.json({"code":300,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (data) {
                var filedArr = ["unit_id=?,title=?,content=?,option_name=?,option_url=?,creator=?"];
                var dataArr = [unit_id,title,content,fileName,path,user];
                if(data){
                    getData.updata("t_scenario",filedArr,dataArr,"id",id,function(err,data) {
                        if(err){
                            res.json({"code":400,"msg":"数据修改错误"});
                        }else{
                            log.insertLog(user,"远程考核","修改想定");
                            res.json({"code":0,"msg":"修改成功"});
                        }
                    })
                }else{
                    res.json({"code":300,"msg":"用户未登录"});
                }
            })
        }
    }catch(e){
        console.log(e);
        res.json({"code":300,"msg":"未知错误"});
    }
}

/**
 * 删除想定
 * @param req
 * @param res
 */
exports.del_scenario = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    var id= query.id || -1;
    var path = query.path || "";
    try{
        if(user == -1 || token == -1 || id == -1){
            res.json({"code":300,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (data) {
                if(data){
                    getData.updata("t_scenario",filedArr,dataArr,"id",id,function(err,data) {
                        if(err){
                            res.json({"code":400,"msg":"数据删除错误"});
                        }else{
                            log.insertLog(user,"远程考核","删除想定");
                            res.json({"code":0,"msg":"删除成功"});
                        }
                    })
                }else{
                    res.json({"code":300,"msg":"用户未登录"});
                }
            })
        }
    }catch(e){
        console.log(e);
        res.json({"code":300,"msg":"未知错误"});
    }
}

/**
 * 发布想定
 * @param req
 * @param res
 */
exports.push_scenario = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    var id= query.id || -1;
    try{
        if(user == -1 || token == -1 || id == -1){
            res.json({"code":300,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (data) {
                if(data){
                    getData.updata("t_scenario","is_release=?",1,"id",id,function(err,data) {
                        if(err){
                            res.json({"code":400,"msg":"发布错误"});
                        }else{
                            log.insertLog(user,"远程考核","发布想定");
                            res.json({"code":0,"msg":"发布成功"});
                        }
                    })
                }else{
                    res.json({"code":300,"msg":"用户未登录"});
                }
            })
        }
    }catch(e){
        console.log(e);
        res.json({"code":300,"msg":"未知错误"});
    }
}

/**
 * 添加考核发布
 * @param req
 * @param res
 */
exports.addtestPlay = function (req,res) {
    // res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    var person =query.person||-1;
    var pubject_id = query.pubject_id||-1;
    var subject_id = query.subject_id ||-1;
    var exam_id =query.exam_id ||-1;
    var number = query.number ||-1;
    var total_score = query.total_score ||-1;
    var exam_time = query.exam_time ||-1;
    var creator = query.creator ||-1;
    var create_time = query.create_time ||-1;
    var is_release = query.is_release||0;
    try{
        if(user == -1 || token == -1 || person==-1||pubject_id==-1||subject_id == -1||
            exam_id==-1||  number==-1 ||total_score==-1 ||exam_time==-1||creator==-1||create_time==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (data) {
                if(data){
                    var filed =["person","pubject_id","subject_id","exam_id","number","total_score","exam_time","creator","create_time","is_release"];
                    var fileData = [person,pubject_id,subject_id,exam_id,number,total_score,exam_time,creator,create_time,is_release];
                    getData.data_add_modify("t_release",filed,fileData,null,null,function (err,data) {
                        if(err ==0){
                            log.insertLog(user,"远程考核","添加考核");
                            res.json({"code":0,"msg":"添加成功"});
                        }else{
                            console.log(err.message);
                            res.json({"code":300,"msg":"添加失败"});
                        }
                    })
                }else{
                    res.json({"code":400,"msg":"用户未登录"});
                }
            })
        }
    }catch(e){
        res.json({"code":200,"msg":"未知错误"});
    }
};


/**
 * 发布考核
 * @param req
 * @param res
 */
exports.testPlay = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    console.log(req.body);
    try{
        if(user == -1 || token == -1){
            res.json({"code":100,"msg":"参数错误"})
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (data) {
                if(data){
                   var ids = query.ids;
                   var flag=true;
                    async.map(ids,function(item,cb){
                        getData.updata("t_release","is_release=?",1,"id",item,function (err,data) {
                            if(err==0){
                                flag =true;
                                cb(0,data);
                            }else{
                                flag =false;
                                cb(err,0);
                            }
                        })

                    },function (err,data) {
                        console.log(err);
                        console.log(data);
                        if(flag){
                            log.insertLog(user,"远程考核","发布考核");
                            res.json({"code":0,"msg":"发布成功"});
                        }else{
                            res.json({"code":100,"msg":"发布失败"});
                        }
                    })
                }else{
                    res.json({"code":400,"msg":"用户未登录"});
                }
            })
        }
    }catch(e){
        res.json({"code":200,"msg":"未知错误"});
    }
};


/**
 * 修改考核
 * @param req
 * @param res
 */
exports.editPlay = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    var id = query.id||-1;
    var person =query.person||-1;
    var pubject_id = query.pubject_id||-1;
    var subject_id = query.subject_id ||-1;
    var exam_id =query.exam_id ||-1;
    var number = query.number ||-1;
    var total_score = query.total_score ||-1;
    var exam_time = query.exam_time ||-1;
    var creator = query.creator ||-1;
    var create_time = query.create_time ||-1;
    var is_release = query.is_release||0;
    try{
        if(user == -1 || token == -1 ||id==-1|| person==-1||pubject_id==-1||subject_id == -1||
            exam_id==-1||  number==-1 ||total_score==-1 ||exam_time==-1||creator==-1||create_time==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (data) {
                if(data){
                    getData.select_data("t_release",null,"id",id,null,null,function (err,row) {
                        if(err==0){
                            if(row.length>0){
                                var filed =["person=?","pubject_id=?","subject_id=?","exam_id=?","number=?","total_score=?","exam_time=?","creator=?","create_time=?","is_release=?"];
                                var fileData = [person,pubject_id,subject_id,exam_id,number,total_score,exam_time,creator,create_time,is_release];
                                getData.updata("t_release",filed,fileData,"id",id,function (err,data) {
                                    if(err ==0){
                                        log.insertLog(user,"远程考核","修改考核任务");
                                        res.json({"code":0,"msg":"修改成功"});
                                    }else{
                                        res.json({"code":300,"msg":"修改失败"});
                                    }
                                })
                            }else{
                                res.json({"code":302,"msg":"此考核不存在或id错误"});
                            }
                        }else{
                            res.json({"code":301,"msg":"查询失败"});
                        }
                    })

                }else{
                    res.json({"code":400,"msg":"用户未登录"});
                }
            })
        }
    }catch(e){
        res.json({"code":200,"msg":"未知错误"});
    }
};

/**
 * 删除考核任务
 * @param req
 * @param res
 */
exports.delPlay = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    var id = parseInt(query.id)||-1;
    try{
        if(user == -1 || token == -1 ||id==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (data) {
                if(data){
                    getData.select_data("t_release",null,"id",id,null,null,function (err,row) {
                        if(err==0){
                            if(row.length>0){
                                var sql = "delete from t_release where id =?";
                                db.insert([id],sql,function (err,data) {
                                    if(err == 0){
                                        log.insertLog(user,"远程考核","删除考核任务");
                                        res.json({"code":0,"msg":"删除成功"});
                                    }else{
                                        console.log(err.message);
                                        res.json({"code":300,"msg":"删除失败"});
                                    }
                                })
                            }else{
                                res.json({"code":302,"msg":"此考核不存在或id错误"});
                            }
                        }else{
                            res.json({"code":301,"msg":"查询失败"});
                        }
                    })
                }else{
                    res.json({"code":400,"msg":"用户未登录"});
                }
            })
        }
    }catch(e){
        res.json({"code":200,"msg":"未知错误"});
    }
};


/**
 * 获取考核任务
 * @param req
 * @param res
 */
exports.getPlay = function (req,res) {
    // res.setHeader("Access-Control-Allow-Origin","*");
    console.log(req.url);
    var query = req.body;
    console.log(query);
    var user = query.user || -1;
    var token = query.token || -1;
    try{
        if(user == -1 || token == -1 ){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (data) {
                if(data){
                    getData.select_data("t_release",null,null,null,null,null,function (err,row) {
                        if(err==0){
                            res.json({"code":0,"msg":"查询成功","row":row});
                        }else{
                            res.json({"code":301,"msg":"查询失败"});
                        }
                    })
                }else{
                    res.json({"code":400,"msg":"用户未登录"});
                }
            })
        }
    }catch(e){
        res.json({"code":200,"msg":"未知错误"});
    }
};





