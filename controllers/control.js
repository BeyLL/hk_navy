var getData = require('../models/dbsql');                   //通用sql查询
var async = require("async");
/**
 * 添加科目
 *
 */
exports.add_Subject = function (req,res,next) {
    // if(req.session && req.session.user()){
    try{
        var body = req.body.data;
        var first_subject = body.first_subject,
            second_subject = body.second_subject,
            weight_score = body.weight_score,
            age_different = body.age_different,
            sex_different=body.sex_different,
            achieve_type = body.achieve_type,
            train_type = body.train_type,
            remark = body.remark?body.remark:"";
        var abc = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var n=6,s="",mn="";
        for(var i=0; i<n;i++){
            var rand = Math.floor(Math.random()* abc.length);
            var rands = Math.floor(Math.random()* abc.length);
            s+=abc.charAt(rand);
            mn+=abc.charAt(rands);
        }
        console.log(s);
        console.log(mn);
        var logData = req.body.logData;
        var aData = ["id","first_subject","second_subject","weight_score","age_different","sex_different","achieve_type","train_type","remark","cloumn","cloumns"];
        var bData = [0,first_subject,second_subject,weight_score,age_different,sex_different,achieve_type,train_type,remark,s,mn];
        getData.select_data("t_subject","id","second_subject",second_subject,null,null,function (err,result) {
            if(result ==""){
                getData.into("t_subject",aData,bData,function (err,data) {
                    console.log(err);
                    if(data){
                        getData.select_data("t_subject","id","second_subject",second_subject,null,null,function (err,kid) {
                            if(kid){
                                var subject_id = kid[0].id ;
                                var abc=[];
                                var bcd =[];
                                for(var a=0;a<logData.length;a++){
                                    var buteData=[];
                                    var keyData =[];
                                    buteData[0] = "id";
                                    keyData[0] = 0;
                                    for(var b in logData[a]){
                                        buteData.push(b);
                                        keyData.push(logData[a][b]);
                                    }
                                    buteData.push("subject_id");
                                    keyData.push(subject_id);
                                    abc.push(buteData);
                                    bcd.push(keyData);
                                }
                                var dataArr =[];
                                for(var i=0;i<bcd.length;i++){
                                    dataArr.push(bcd[i]);
                                }
                                console.log(abc[0]);
                                console.log(dataArr);
                                getData.insert_batch("t_assessment",abc[0],dataArr,function (err,kid) {
                                    if(kid){
                                        res.json({"code":0,"msg":"添加成功"});
                                    }else{
                                        res.json({"code":150,"msg":"添加失败"});
                                    }
                                })

                            }else{
                                return res.json({"code":50,"msg":"t_subject查询数据失败"});
                            }
                        })

                    }else{
                        res.json({"code":51,"msg":"t_subject表插入数据失败"});
                    }
                })
            }else if(result.length>0){
                res.json({"code":100,"msg":"科目已存在！"});
            }else{
                res.json({"code":200,"msg":"数据库查询失败！"});
            }
        })

    }catch (e){
        console.log(e);
        res.json({"code":300,"msg":"unknow error"})
    }
    // }else{
    //     res.redirect('/');
    // }
}


/**
 * 修改科目
 *
 */
exports.update_Subject = function (req,res,next) {
    // if(req.session && req.session.user()){
    try{
        // var body = req.body;
        // console.log(body);
        // var id=body.id?body.id:"";
        // console.log(id);
        // if(id ==""){
        //     var is_valid = "0";
        // }else{
        //     var is_valid = "1";
        // }
        // var filesArr = Object.keys(body.data);
        // filesArr.push("is_valid");
        // var dataArr =[];
        // for(var i in body.data){
        //     dataArr.push(body.data[i]);
        // }
        // dataArr.push(is_valid);
        // console.log(is_valid);
        // console.log(filesArr);
        // console.log(dataArr);
        // getData.data_add_modify("t_subject",filesArr,dataArr,"id",id,function (err,data) {
        //     if(err ==0){
        //         if(id){
        //             res.json({"code":0,"msg":"修改成功"})
        //         }else{
        //             res.json({"code":0,"msg":"添加成功"})
        //         }
        //
        //     }else{
        //         if(id){
        //             res.json({"code":100,"msg":"修改失败"})
        //         }else{
        //             res.json({"code":0,"msg":"添加失败"})
        //         }
        // }
        // })
        var body = req.body.data;
        var id = body.id;
            first_subject = body.first_subject,
            second_subject = body.second_subject,
            weight_score = body.weight_score,
            age_different = body.age_different,
            sex_different=body.sex_different,
            achieve_type = body.achieve_type,
            train_type = body.train_type,
            remark = body.remark?body.remark:"";
        var logData = req.body.logData;
        var aData = ["first_subject =?","second_subject=?","weight_score=?","age_different=?","sex_different=?","achieve_type=?","train_type =?","remark=?"];
        var bData = [first_subject,second_subject,weight_score,age_different,sex_different,achieve_type,train_type,remark];
        getData.updata("t_subject",aData,bData,"id",id,function (err,data) {
            if(data){
                var subject_id = id ;
                var abc=[];
                var bcd =[];
                for(var a=0;a<logData.length;a++){
                    var buteData=[];
                    var keyData =[];
                    for(var b in logData[a]){
                        keyData.push(logData[a][b]);
                        if(b!="id"){
                            buteData.push(b);
                        }
                    }
                    abc.push(buteData);
                    bcd.push(keyData);
                }
                console.log(abc);
                console.log(bcd);
                for(var i=0;i<abc.length;i++){
                   var id = bcd[i][bcd[i].length-1];
                    getData.data_add_modify("t_assessment",abc[i],bcd[i],"id",id,function (err,bbq) {
                        if(bbq){

                        }else{
                            res.json({"code":100,"msg":"修改失败"});
                        }
                    })

                }
                res.json({"code":0,"msg":"修改成功"});
            }else{
                res.json({"code":200,"msg":"t_subject表插入数据失败"});
            }
        })
    }catch (e){
        console.log(e);
        res.json({"code":300,"msg":"unknow error"})
    }
    // }else{
    //     res.redirect('/');
    // }
};

/**
 * 删除科目
 *
 */
exports.delete_Subject = function (req,res,next) {
    // if(req.session && req.session.user()){
    try{
        console.log(req.body);
        var id = req.body.id;
        var is_valid = "0";
        var arr = ["is_valid =?"];
        var brr = [is_valid];
        //***********************并行
        async.parallel([
            function (msg) {
                getData.updata("t_subject",arr,brr,"id",id, function (err,result) {
                    msg(err,result);
                })
            },
            function (user) {
                getData.updata("t_assessment",arr,brr,"subject_id",id, function (err,datas) {
                    user(err,datas);
                })
            }
        ], function (err,data) {
            if(err){
                res.json({"code":200,"msg":"删除失败"});
            }else{
                res.json({"code":0,"msg":"删除成功"});
            }
        });
    }catch (e){
        console.log(e);
        res.json({"code":300,"msg":"unknow error"})
    }
    // }else{
    //     res.redirect('/');
    // }
}