var getData = require('../models/dbsql');                   //通用sql查询
var currency = require('../controllers/currencyRoute');
var ejsExcel = require("ejsexcel");
var xlsx = require('node-xlsx');
var async = require("async");
var fs = require("fs");
var permiss = require('../controllers/permissControl');
var log = require('../controllers/logControl');
var db = require('../models/db');

/************************* 成绩管理 ***********************************/

/**
 * 根据一级单位ID查询二级单位
 * @param req
 * @param res
 * @param next
 */
exports.get_second_class = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    try {
        var pid = req.query.id?req.body.id:"";
        if(pid ==""){
            res.redirect('back');
            return;
        }
        var a_filed=["id","name"];
        getData.select_data("t_unit",a_filed,"pid",pid,null,null,function (err,result) {
            if(err ==0){
                return res.end({'code':0,'second_class': result});
            }else{
                return res.end(JSON.stringify({'code':200, 'msg': "查询失败"}));
            }
        })
    }catch (e){
        console.log(e);
        return res.json({"code":300,"msg":"unknow error"});
    }
}

/**
 * 成绩录入
 * @param req
 * @param res
 * @param next
 */
exports.add_record = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    try {
        var query = req.body;
        var second_subject = req.body.second_subject;
        var dataArr = query.dataArr;
        var datafiled=[];

        for(var i=0,l=dataArr.length;i<l;i++){
            var dataBrr =[];
            var dataCrr =[];
            for(var name in dataArr[i]){
                dataBrr.push(name);
                dataCrr.push(dataArr[i][name]);
            }
            datafiled.push(dataCrr);
        }
        getData.insert_batch("t_record",dataBrr,datafiled,function (err,data) {                        //插入成绩表
            if(err ==0){
                // getData.select_data("t_record","second_class",null,null,null,null,function (err,subject) {      //查询二级科目
                //     if(err ==0){
                //         var dataGrr=[];
                //         for(var i =0,len=subject.length;i<len;i++){
                //             if(dataGrr.indexOf(subject[i].second_class) ==-1){
                //                 dataGrr.push(subject[i].second_class);
                //             }
                //         }
                //
                //         tools.getDatas(dataGrr,function (err,arr) {
                //         //     getData.select_cloumn(arr[0].cloumn, function (err, exist) {
                //         //     if (err == 0) {
                //         //
                //         //     } else {
                //         //
                //         //     }
                //         // })
                //     })
                //         // for(var a=0,l =dataGrr.length;a<l;a++){
                //         //     var filed =["second_subject","cloumn","cloumns"];
                //         //     getData.select_data("t_subject",filed,"second_subject",dataGrr[a],null,null,function (err,kid) {
                //         //         if(err ==0){
                //         //             dataFiled.push(kid);
                //         //             getData.select_cloumn(kid[0].cloumn,function (err,exist) {
                //         //                 if(err==0){
                //         //
                //         //                 }else{
                //         //
                //         //                 }
                //         //             })
                //         //         }else{
                //         //             return res.end(JSON.stringify({'code':120, 'msg': "查询失败"}));
                //         //         }
                //         //     })
                //         // }
                //     }else{
                //         return res.end(JSON.stringify({'code':120, 'msg': "查询失败"}));
                //     }
                // })
                return res.json({"code":0,"msg":"成绩录入成功"});
            }else{
                return res.json({"code":200,"msg":"成绩录入失败"});
            }
        })
    }catch (e){
        console.log(e);
        return res.json({"code":300,"msg":"unknow error"});
    }
}



/**
 * 成绩导出
 * @param req
 * @param res
 * @param next
 */
exports.record_export = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var s=[];
    var num=0;              //考核次数
    var names=[],
        p_nums=[],
        p_num=0;            //参加人数
    var subjs=[],
        sub_nums=[],
        sub_num=0;          //科目数
    var examination=[],
        exam_num=0;         //补考人数
    var ach=[],
        achievement=[],     //成绩评定为数字
        achievements=[],    //成绩评定为汉字
        passes=[],          //及格
        goods=[],           //良好
        excell=[];          //优秀
    var unps=[],           //不及格
        ps=[],             //及格
        fine=[];           //良好
    try {
        var exlBuf = fs.readFileSync("../public/template/record.xlsx");
        async.parallel([
            function (cb) {
                getData.select_data("t_record",null,null,null,null,null,function (err,datas) {
                    cb(err,datas);
                })
            }
        ],function (err,result) {
            for(var a=0;a<result[0].length;a++){
                s.push(result[0][a]);
                names.push(result[0][a].name);
                subjs.push(result[0][a].second_class);
                if(result[0][a].examination != ""){
                    examination.push(result[0][a].examination);
                }
                ach.push(result[0][a].evaluation);
            }
            //考核人次
            num=s.length;
            //补考人数
            exam_num=examination.length;
            //参加人数
            for(var a=0;a<names.length;a++){
                if(p_nums.indexOf(names[a]) == -1){
                    p_nums.push(names[a]);
                }
            }
            p_num=p_nums.length;
            //科目数
            for(var b=0;b<subjs.length;b++){
                if(sub_nums.indexOf(subjs[b]) == -1){
                    sub_nums.push(subjs[b]);
                }
            }
            sub_num=sub_nums.length;
            for(var c=0;c<ach.length;c++){
                if(!isNaN(parseInt(ach[c]))){
                    achievements.push(ach[c]);
                }else{
                    achievement.push(ach[c]);
                }
            }
            for(var d=0;d<achievements.length;d++){
                if(Number(achievements[d]) >= 60){
                    passes.push(achievements[d]);
                }else{
                    unps.push(achievements[d]);
                }
                if(Number(achievements[d]) >= 75){
                    goods.push(achievements[d]);
                }else if(Number(achievements[d]) >= 60){
                    ps.push(achievements[d]);
                }
                if(Number(achievements[d]) >= 90){
                    excell.push(achievements[d]);
                }else if(Number(achievements[d]) >= 75){
                    fine.push(achievements[d]);
                }
            }
            for(var e=0;e<achievement.length;e++){
                if(achievement[e] == "合格" || achievement[e] == "良好" || achievement[e] == "优秀"){
                    passes.push(achievement[e]);
                }else{
                    unps.push(achievement[e]);
                }
                if(achievement[e] == "合格"){
                    ps.push(achievement[e]);
                }
                if(achievement[e] == "良好"){
                    goods.push(achievement[e]);
                    fine.push(achievement[e]);
                }
                if(achievement[e] == "优秀"){
                    excell.push(achievement[e]);
                }
            }
            //合格率
            var pass = (Math.round(Number(passes.length/num)*10000)/100).toFixed(1)+"%";
            //优良率
            var good = (Math.round(Number((goods.length+excell.length)/num)*10000)/100).toFixed(1)+"%";
            //优秀率
            var excellent = (Math.round(Number(excell.length/num)*10000)/100).toFixed(1)+"%";
            var data=[[{"name":"xx旅团成绩记录表","record":"【成绩统计】 考核人次"+Number(num)+", 参加人数"+Number(p_num)+
                        ", 科目数"+Number(sub_num)+", 合格率"+pass+", 优良率"+good+", 优秀率"+excellent+
                        "  【成绩分布】 <60分(不及格)"+Number(unps.length)+", 60~75分(及格)"+Number(ps.length)+
                        ", 75~90分(良好)"+Number(fine.length)+", >=90分(优秀)"+Number(excell.length)+"  【补考人数】"+Number(exam_num)}]];
            data.push(s);
            var date="";
            currency.getTime(function (err,dates) {
                if(err == 0){
                    date = dates;
                }
            });
            var fileName = "xx旅团成绩记录表_"+date;
            ejsExcel.renderExcel(exlBuf,data).then(function (exlBuf2) {
                res.setHeader('Content-Type','application/vnd.openxmlformats');
                res.setHeader('Content-Disposition','attachment;filename='+encodeURI(fileName)+'.xlsx');
                res.write(exlBuf2,'binary');
                res.end();
            });
        });
    }catch (e){
        return res.json({"code":300,"msg":"unknow error"});
    }
}

/**
 * 成绩导入
 * @param req
 * @param res
 */
exports.record_import =function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    try {
        currency.upload(req,res,function (err,re) {
            if(err == 0){
                var obj = xlsx.parse(re);
                //删除上传后文件
                fs.unlinkSync(re);
                var dataArr = [];
                var data = [];
                var c_filed=["unit_first","unit_second","name","card_id","second_class","achievement","evaluation",
                    "check_time","examination","coach","staff"];
                for(var i in obj[0].data){
                    dataArr.push(obj[0].data[i]);
                }
                for(var j=2;j<dataArr.length;j++){
                    data.push(dataArr[j]);
                }
                var filed = ["card_id","second_class","check_time"];
                getData.select_data("t_record",filed,null,null,null,null,function (err,datas) {
                    if(datas){
                        for(var i=0;i<datas.length;i++){
                            for(var j=0;j<data.length;j++){
                                if(data[j][3] == datas[i].card_id && data[j][4] == datas[i].second_class && data[j][7] == datas[i].check_time){
                                    //从data中第j的位置删除1个元素
                                    data.splice(j,1);
                                    j=j-1;
                                    //dataArr.push(data);
                                }
                            }
                        }
                        if(data.length > 0){
                            //将空的数据置为''
                            for(var k=0;k<data.length;k++){
                                for(var a=0;a<11;a++){
                                    if(data[k].length <= 11){
                                        if(!data[k][10]){
                                            data[k][10] = '';
                                        }
                                        if(!data[k][a]){
                                            data[k][a] = '';
                                        }
                                    }
                                }
                            }
                            getData.insert_batch("t_record",c_filed,data,function (err,result) {
                                if(result){
                                    return res.json({"code":0,"msg":"导入成功"});
                                }else{
                                    console.log(err);
                                    return res.json({"code":100,"msg":"导入失败"});
                                }
                            })
                        }else{
                            return res.json({"code":200,"msg":"已存在相同数据，不能重复导入"});
                        }
                    }
                })
            }
        })
    }catch (e){
        console.log(e);
        return res.json({"code":300,"msg":"unknow error"});
    }
}

/**
 * 成绩导入模板下载
 * @param req
 * @param res
 * @param next
 */
exports.record_download = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    try{
        var exlBuf = fs.readFileSync("../public/download/模板_成绩.xlsx");
        var fileName = "成绩导入模板";
        res.setHeader('Content-Type','application/vnd.openxmlformats');
        res.setHeader('Content-Disposition','attachment;filename='+encodeURI(fileName)+'.xlsx');
        res.write(exlBuf,'binary');
        res.end();
    }catch (e){
        console.log(e);
        return res.json({"code":300,"msg":"未知错误"});
    }
}

/**
 * 获取个人所有成绩
 * @param req
 * @param res
 */
exports.personRecord = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    var user = body.user || -1;
    var token = body.token || -1;
    var card_id = body.card_id || -1;
    var page = body.page || -1;
    var pageSize = body.pageSize || -1;
    try {
        if(user == -1 || token == -1 || card_id == -1){
            res.json({"code":300,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (date) {
                if(date){
                    var sql ="select p.*, r.* from t_person p, t_record r where p.id = r.uid and p.card_id = ?";
                    db.insert([card_id],sql,function (err,data) {
                        if(err){
                            res.json({"code":400,"msg":"数据查询错误"});
                        }else{
                            var sqls = "select * from t_unit";
                            db.insert(null,sqls,function (err,date) {
                                if(err){
                                    res.json({"code":401,"msg":"数据查询错误"});
                                }else{
                                    for(var i=0;i<data.length;i++){
                                        for(var j=0;j<date.length;j++){
                                            if(data[i].unit_first == date[j].id){
                                                data[i].unit_first = date[j].name;
                                            }
                                            if(data[i].unit_second == date[j].id){
                                                data[i].unit_second = date[j].name;
                                            }
                                        }
                                    }
                                    if(page == -1){
                                        res.json({"code":0,"msg":"查询成功","total":data.length,"data":data});
                                    }else{
                                        if(page < 1){
                                            page = 1;
                                        }
                                        page = (page -1 )*pageSize;
                                        var sql ="select p.*, r.* from t_person p, t_record r where p.id = r.uid and p.card_id = ? limit ?,?";
                                        db.insert([card_id,parseInt(page),parseInt(pageSize)],sql,function (err,result) {
                                            if(err){
                                                console.log(err.message);
                                                res.json({"code":410,"msg":"数据查询错误"});
                                            }else{
                                                var sqls = "select * from t_unit";
                                                db.insert(null,sqls,function (err,date) {
                                                    if (err) {
                                                        res.json({"code": 401, "msg": "数据查询错误"});
                                                    } else {
                                                        for (var i = 0; i < result.length; i++) {
                                                            for (var j = 0; j < date.length; j++) {
                                                                if (result[i].unit_first == date[j].id) {
                                                                    result[i].unit_first = date[j].name;
                                                                }
                                                                if (result[i].unit_second == date[j].id) {
                                                                    result[i].unit_second = date[j].name;
                                                                }
                                                            }
                                                        }
                                                        res.json({"code":0,"msg":"查询成功","total":data.length,"data":result});
                                                    }
                                                })
                                            }
                                        })
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
    }catch (e){
        console.log(e);
        res.json({"code":200,"msg":"未知错误"});
    }
}

/**
 * 根据单位获取人员成绩
 * @param req
 * @param res
 */
exports.getRecord = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    var user = body.user || -1;
    var token = body.token || -1;
    var page = body.page || -1;
    var pageSize = body.pageSize || -1;
    var unit_first = body.unit_first || -1;
    var unit_second = body.unit_second || -1;
    try {
        if(user == -1 || token == -1){
            res.json({"code":300,"msg":"参数错误"});
            return;
        }else{
            permiss.checkMobile2Token(user,token,function (date) {
                page = (page - 1)*pageSize;
                if(date){
                    var sql = "select * from t_unit";
                    db.insert(null,sql,function (err,result) {
                        if(err){
                            res.json({"code":400,"msg":"数据查询错误"});
                        }else{
                            if ((unit_first == -1 && unit_second==-1) || (unit_first != -1 && unit_second==-1)) {
                                var sql = "select r.*,p.* from t_person p, t_record r where r.uid = p.id ";
                                db.insert(null,sql,function (err,row) {
                                    if(err){
                                        res.json({"code":401,"msg":"数据查询错误"});
                                    }else{
                                        var sql = "select p.*, r.* from t_person p, t_record r where r.uid = p.id limit ?,?";
                                        db.insert([parseInt(page),parseInt(pageSize)],sql,function (err,data) {
                                            if(err){
                                                res.json({"code":402,"msg":"数据查询错误"});
                                            }else{
                                                for(var i=0;i<data.length;i++){
                                                    for (var j = 0; j < result.length; j++) {
                                                        if (data[i].unit_first == result[j].id) {
                                                            data[i].unit_first = result[j].name;
                                                        }
                                                        if (data[i].unit_second == result[j].id) {
                                                            data[i].unit_second = result[j].name;
                                                        }
                                                    }
                                                }
                                                res.json({"code":0,"msg":"查询成功","total":row.length,"data":data});
                                            }
                                        })
                                    }
                                })
                            }else if(unit_first==-1 && unit_second!=-1){
                                var sql = "select r.*,p.* from t_person p, t_record r where r.uid = p.id and unit_second = ?";
                                db.insert([unit_second],sql,function (err,row) {
                                    if(err){
                                        res.json({"code":401,"msg":"数据查询错误"});
                                    }else{
                                        var sql = "select r.*,p.* from t_person p, t_record r where r.uid = p.id and unit_second = ? limit ?,?";
                                        db.insert([unit_second,parseInt(page),parseInt(pageSize)],sql,function (err,data){
                                            if(err){
                                                res.json({"code":402,"msg":"数据查询错误"});
                                            }else{
                                                for(var i=0;i<data.length;i++){
                                                    for (var j = 0; j < result.length; j++) {
                                                        if (data[i].unit_first == result[j].id) {
                                                            data[i].unit_first = result[j].name;
                                                        }
                                                        if (data[i].unit_second == result[j].id) {
                                                            data[i].unit_second = result[j].name;
                                                        }
                                                    }
                                                }
                                                res.json({"code":0,"msg":"查询成功","total":row.length,"data":data});
                                            }
                                        })
                                    }
                                })
                            }else if(unit_first !=-1 && unit_second!=-1){
                                var sql = "select r.*,p.* from t_person p, t_record r where r.uid = p.id and unit_first = ? and unit_second = ?";
                                db.insert([unit_first,unit_second],sql,function (err,row) {
                                    if(err){
                                        res.json({"code":401,"msg":"数据查询错误"});
                                    }else{
                                        var sql = "select r.*,p.* from t_person p, t_record r where r.uid = p.id and unit_first = ? and unit_second = ? limit ?,?";
                                        db.insert([,unit_first,parseInt(page),parseInt(pageSize)],sql,function (err,data) {
                                            if(err){
                                                res.json({"code":402,"msg":"数据查询错误"});
                                            }else{
                                                for(var i=0;i<data.length;i++){
                                                    for (var j = 0; j < result.length; j++) {
                                                        if (data[i].unit_first == result[j].id) {
                                                            data[i].unit_first = result[j].name;
                                                        }
                                                        if (data[i].unit_second == result[j].id) {
                                                            data[i].unit_second = result[j].name;
                                                        }
                                                    }
                                                }
                                                res.json({"code":0,"msg":"查询成功","total":row.length,"data":data});
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
        res.json({"code":200,"msg":"未知错误"});
    }
}


exports.deleteRecord =function (req,res) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var query = req.body;
    try {
        var user = query.user || -1;
        var token = query.token || -1;
        if (user == -1 || token == -1) {
            res.json({"code": 100, "msg": "参数错误"});
            return;
        }
        permiss.checkMobile2Token(user, token, function (data) {
            if (data) {
                var id = JSON.parse(query.id);
                async.map(id,function (item,cb) {
                    getData.delete_data("t_record",null,"id",item,function (err,data) {
                        cb(null,data)
                    })
                },function (err,row) {
                    log.insertLog(user,"成绩管理","删除成绩记录");
                    res.json({"code":0,"msg":"删除成功"});
                })
            } else {
                res.json({"code": 400, "msg": "账号与Token不匹配"});
            }
        })
    }catch(e) {
        console.log(e);
        res.json({"code":200,"msg":"未知错误"});
    }
}