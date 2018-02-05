var getData = require('../models/dbsql');
var formidable = require('formidable');
var xlsx = require('node-xlsx');
var fs = require('fs');
var permiss = require('../controllers/permissControl');
//分页带排序查询
exports.pageWay = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    var user = body.user||-1;
    var token =body.token||-1;
    try{
        if(user ==-1 || token==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }
        permiss.checkMobile2Token(user,token,function (data) {
            if(data){
                var filedArr = body.filedArr ? body.filedArr : '',
                    dataArr = body.dataArr ? body.dataArr : '',
                    selcode = body.selcode ? body.selcode : '',
                    sellift = body.sellift ? body.sellift : '',
                    page = body.page ? parseInt(body.page) : 1,
                    num = body.num ? parseInt(body.num) : 12,
                    tb_name = body.tb_name;
                if(tb_name ==""){
                    res.json({"code": 1, "msg": "tb_name undefined"})
                }
                getData.select_data_orderby(tb_name,null,filedArr,dataArr,selcode,sellift,page,num,function (err,data) {
                    if(data){
                         res.json({'code': 0, 'msg': " 查询数据成功","Q": data});
                    }else{
                        res.json({ "code": 100, "msg":"查询数据库错误"});
                    }
                })
            }else{
                res.json({"code":400,"msg":"用户未登录"});
            }
        })

    }catch (e){
        res.json({ "code": 300, "msg":  "unkown error" });
    }

};


/**
 *显示图表
 */
exports.diplay_chart = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    var user = body.user||-1;
    var token =body.token||-1;
    try{
        if(user ==-1 || token==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }
        permiss.checkMobile2Token(user,token,function (data) {
            if(data){
                var condition = body.condition || -1,             //查询的字段名（例如性别、民族、文化程度等）
                    unit_first = body.unit_first ||-1,
                    unit_second = body.unit_second ||-1;
                if(condition==-1){
                    res.json({"code":101,"msg":"参数错误"});
                    return;
                }
                getData.select_data_chart("t_person",condition,"unit_first",unit_first,"unit_second",unit_second,function (err,data) {
                    if(data){
                        var sum=0;                                 //此字段各类型数据的总数
                        var number=[];                             //每个类型的数量集合
                        for(var i=0;i<data.length;i++){
                            sum=sum+parseInt(data[i].counts);
                            number.push(data[i].counts);
                        }
                        var Percentage="";                       //百分比
                        var perData=[];
                        for(var k=0;k<number.length;k++){
                            var kkk={};
                            Percentage=(Math.round(number[k] / sum * 10000) / 100.00 + "%");
                            kkk.type = data[k][condition];
                            kkk.Percentage=Percentage;
                            perData.push(kkk);
                        }
                        res.json({'code': 0, 'msg': " 查询数据成功","row": perData,"data":data,"total":sum});
                    }else{
                        res.json({ "code": 100, "msg":"查询数据库错误"});
                    }
                })
            }else{
                res.json({"code":400,"msg":"用户未登录"});
            }
        })
    }catch (e){
        res.json({ "code": 300, "msg": "未知错误"});
    }

};

/**
 * 通用上传方法
 * @param req
 * @param res
 */
exports.upload = function (req,res,cb) {
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.keepExtensions = true;
    form.uploadDir="../public/upload/files";
    form.parse(req,function (err,fileds,files) {
        var path = files.excl.path;
        if(path.split(".")[3] == 'xlsx' || path.split(".")[3] == 'xls'){
            cb(0,path);
        }else{
            return res.json({"code":300,"msg":"文件格式错误"});
        }
    })

}

/**
 * 获取系统当前标准时间（xxxx年xx月xx日xx时xx分）
 * @param callback
 */
exports.getTime = function (callback) {
    var time = new Date();
    var year = time.getFullYear(),
        month = time.getMonth()+1,
        day = time.getDate(),
        hour = time.getHours(),
        minute = time.getMinutes();
    var date = year+"年"+month+"月"+day+"日"+hour+"时"+minute+"分";
    callback(0,date);
}


//分页带排序查询
exports.muchPageWay = function (req,res,next) {
    res.setHeader("Access-Control-Allow-Origin","*");
    var body = req.body;
    var user = body.user||-1;
    var token =body.token||-1;
    try{
        if(user ==-1 || token==-1){
            res.json({"code":100,"msg":"参数错误"});
            return;
        }
        permiss.checkMobile2Token(user,token,function (data) {
            if(data){
                var filedArr = body.filedArr ? body.filedArr : '',
                    dataArr = body.dataArr ? body.dataArr : '',
                    selcode = body.selcode ? body.selcode : '',
                    sellift = body.sellift ? body.sellift : '',
                    page = body.page ? parseInt(body.page) : 1,
                    num = body.num ? parseInt(body.num) : 10,
                    tb_name = body.tb_name ||  -1;
                if(tb_name ==-1){
                    res.json({"code": 1, "msg": "tb_name undefined"})
                }
                getData.select_data_much(tb_name,null,filedArr,dataArr,selcode,sellift,page,num,function (err,data) {
                    if(data){
                        return res.end(JSON.stringify({'code': 0, 'msg': " 查询数据成功","row": data}));
                    }else{
                        res.json({ "code": 300, "msg":"查询数据库错误"});
                    }
                })
            }else{
                res.json({"code":400,"msg":"用户未登录"});
            }
        })

    }catch (e){
        console.log(e);
        res.json({ "code": 300, "msg":  "unkown error" });
    }

};