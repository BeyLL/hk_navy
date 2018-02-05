var db = require("./db");

//通用查询类单条件简单类型
/*********************************************
 * 简介:通用查询类单条件简单类型
 * string(tb_name)       要查询的表名
 * string(c_filed)       要查询的字段集合
 * string(d_filed)       查询匹配的字段名
 * string(data)          查询匹配的值
 * function(callback)    回调函数
 *********************************************/
exports.select_data = function(tb_name,c_filed,d_filed,data,f_arr,f_data,callback){
    c_filed = c_filed?c_filed:"*";

    var str = '';
    if(d_filed){
        str = " where "+d_filed+" = " + JSON.stringify(data);
        if(f_arr != null){
            str+= " and "+f_arr+" = " +JSON.stringify(f_data);
        }
    }else if(f_arr){
        str = " where "+f_arr+" = " + JSON.stringify(f_data);
    }
    var sqlselect = " SELECT "+ c_filed +" FROM "+ tb_name;
    if(str){
        sqlselect += str;
    }
    db.insert(null,sqlselect,function(err,data){
        if(err === 0){
            callback(0,data);
        }else{
            callback(err,null);
        }
    });
};

//通用删除类单条件简单类型
/*********************************************
 * 简介:通用删除类单条件简单类型
 * string(tb_name)       要查询的表名
 * string(c_filed)       要删除的字段集合
 * string(d_filed)       查询匹配的字段名
 * string(data)          删除匹配的值
 * function(callback)    回调函数
 *********************************************/
exports.delete_data = function(tb_name,c_filed,d_filed,data,callback){
    c_filed = c_filed?c_filed:"";
    var str = '';
    if(d_filed){
        str = " where "+d_filed+" = " + data;
    }
    var sqlselect = " delete "+ c_filed +" FROM "+ tb_name;
    if(str){
        sqlselect += str;
    }
    db.insert(null,sqlselect,function(err,data){
        if(err === 0){
            callback(0,data);
        }else{
            callback(err,null);
        }
    });
};

//添加通用类
/*********************************************
 * 简介:添加修改通用类
 * string(tbName)        表名
 * array(fieldArr)       要修改的字段集合数组
 * array(dataArr)        数据数组
 * function(callback)    回调函数
 *********************************************/
exports.into = function(tbName,fieldArr,dataArr,callback){
    var fieldStr = JSON.stringify(fieldArr);
    fieldStr = fieldStr.replace("[",'(');
    fieldStr = fieldStr.replace("]",')');
    fieldStr = fieldStr.replace(/\"/g,'');
    var values = '';
    for(var a = 0;a<dataArr.length;a++){
        values += "?";
        if(dataArr.length - a > 1){
            values +=",";
        }
    }
    var sqlStrs = "insert into "+ tbName +" "+ fieldStr + " values ("+values+")";
    db.insert(dataArr,sqlStrs,function(err,datas){
        if(err === 0){
            callback(0,datas);
        }else{
            callback(err,null);
        }
    });
};

//通用批量插入
/*********************************************
 * 简介:通用批量插入
 * string(tbName)        表名
 * array(fieldArr)       要插入的字段集合数组
 * array(dataArr)        数据数组:[[],[],[]]
 * function(callback)    回调函数
 *********************************************/
exports.insert_batch = function (tbName,c_filed,data,callback) {
    var dataArr =[tbName,c_filed,data];
    var sqlStrs = "insert into ?? (??) values ?";
    db.insert(dataArr,sqlStrs,function(err,datas){
        if(err === 0){
            callback(0,datas);
        }else{
            callback(err,null);
        }
    });
};

//通用修改类
/*********************************************
 * 简介:通用修改函数类
 * string(tb_name)       要修改的表名
 * string(c_filed)       要修改的字段集合
 * string(f_filed)       要修改字段的值得集合
 * string(d_filed)       修改匹配的字段名
 * string(data)          修改匹配的值
 * function(callback)    回调函数
 *********************************************/
exports.updata = function(tb_name,c_filed,f_filed,d_filed,data,callback){
    var str = '';
    if(d_filed && data){
        str = " where "+d_filed+" = " + JSON.stringify(data);
    }
    var sqlselect = " update "+ tb_name +" set ";
    var sqlselects = sqlselect +c_filed + str;
    db.insert(f_filed,sqlselects,function(err,data){
        if(err === 0){
            callback(0,data);
        }else{
            callback(err,null);
        }
    });
};

//通用添加类
/*********************************************
 * 简介:通用修改函数类
 * string(tb_name)       要修改的表名
 * string(c_filed)       要修改的字段集合
 * string(d_filed)       问号集合
 * function(callback)    回调函数
 *********************************************/
exports.start = function(tb_name,c_filed,d_filed,callback){
    var sqlselect = " INSERT INTO "+ tb_name+""+ (c_filed)+"VALUES" +(d_filed)+"";
    db.insert(null,sqlselect,function(err,data){
        if(err === 0){
            callback(0,data);
        }else{
            callback(err,null);
        }
    });
};

//通用查询类复杂条件带排序带分页方法
/*********************************************
 * 简介:通用查询类复杂条件带排序带分页方法
 * string(tb_name)       要查询的表名（必选）
 * string(c_filed)       要查询的字段集合（可选）
 * array(d_filed)        查询匹配的字段名集合（可选）
 * array(data)           查询匹配的值集合（可选）
 * string(code)          排序条件（可选）
 * array(data)           排序类型（可选）
 * int(page)             当前第几页（可选，默认为1）
 * int(num)              每页共几条（可选，默认为10）
 * function(callback)    回调函数（必选）
 *********************************************/
exports.select_data_orderby = function(tb_name,c_filed,d_filed,data,code,lift,page,num,callback){
    c_filed = c_filed?c_filed:"*";
    var str = '';
    if(d_filed && d_filed.length > 0){
        for(var i=0;i<d_filed.length;i++){
            if(typeof(data[i]) != "undefined"){
                if(i == 0){
                    str += ' where ';
                }else{
                    str += " and ";
                }
                str += d_filed[i] + "=" + JSON.stringify(data[i]);
            }
        }
    }
    var sqlselect = " SELECT "+ c_filed +" FROM "+ tb_name;
    if(str){
        sqlselect += str;
    }
    if(code){
        sqlselect += " order by "+code+" "+lift;
    }
    if(page >= 1){
        page = (page - 1)*num;
        sqlselect += " limit " +  page + ","+num
    }
    db.insert(null,sqlselect,function(err,data){
        if(err === 0){
            callback(0,data);
        }else{
            callback(err,null);
        }
    });
};


//添加修改通用类
/*********************************************
 * 简介:添加修改通用类
 * string(tbName)        表名
 * array(fieldArr)       要修改的字段集合数组
 * array(dataArr)        数据数组
 * string(filed)         查询要修改指定的字段名（新增时为null）
 * int(id)               要修改的指定字段值（新增时为null）
 * function(callback)    回调函数
 * 根据传入的UID进行判断是需要修改数据还是新增数据
 *********************************************/
exports.data_add_modify = function(tbName,fieldArr,dataArr,filed,id,callback){
    if(id){          //修改数据
        var fieldStr = '';
        for(var i = 0;i<fieldArr.length;i++){
            fieldStr += fieldArr[i] + "= ?";
            if(fieldArr.length - i >1){
                fieldStr += ",";
            }
        }
        var sqlStrs = "update "+tbName +" set " + fieldStr + " where "+filed +"=" + id;
        db.insert(dataArr,sqlStrs,function(err,datas){
            if(err === 0){
                callback(0,datas);
            }else{
                callback(err,null);
            }
        });
    }else{          //插入数据
        var fieldStr = JSON.stringify(fieldArr);
        fieldStr = fieldStr.replace("[",'(');
        fieldStr = fieldStr.replace("]",')');
        fieldStr = fieldStr.replace(/\"/g,'');
        var values = '';
        for(var a = 0;a<dataArr.length;a++){
            values += "?";
            if(dataArr.length - a > 1){
                values +=",";
            }
        }
        var sqlStrs = "insert into "+ tbName +" "+ fieldStr + " values ("+values+")";
        db.insert(dataArr,sqlStrs,function(err,datas){
            if(err === 0){
                callback(0,datas);
            }else{
                callback(err,null);
            }
        });
    }
};


//通用图表查询
/*********************************************
 * 简介:通用图表查询
 * string(tbName)        表名
 * array(data)       要修改的字段
 * function(callback)    回调函数
 *********************************************/
exports.select_data_chart = function (tb_name,data,filed,reson,fileds,datas,callback) {
    data = data?data:"*";
    if(reson ==-1 &&datas ==-1){
        var sqlStrs = "SELECT "+data+ " , count(1) AS counts FROM "+tb_name+" GROUP BY "+data;
        var dataArr =[];
    }else if(reson!=-1 && datas!=-1){
        var sqlStrs = "SELECT "+data+ " , count(1) AS counts FROM "+tb_name+" where "+ filed+" = ? and "+ fileds+" = ? GROUP BY "+data;
        var dataArr = [reson,datas];
    }else if(reson !=-1 && datas==-1){
        var sqlStrs = "SELECT "+data+ " , count(1) AS counts FROM "+tb_name+" where "+ filed+" = ? GROUP BY "+data;
        var dataArr = [reson];
    }else if(datas !=-1 && reson==-1){
        var sqlStrs = "SELECT "+data+ " , count(1) AS counts FROM "+tb_name+" where "+ fileds+" = ? GROUP BY "+data;
        var dataArr = [datas];
    }
    console.log(sqlStrs);
    db.insert(dataArr,sqlStrs,function(err,datas){
        if(err === 0){
            callback(0,datas);
        }else{
            callback(err,null);
        }
    });
};

exports.select_cloumn = function (tb_name,data,callback) {
    var data = [tb_name,data];
    var sqlStrs = " select 1 from information_schema.columns where table_name=? and column_name=?";
    db.insert(data,sqlStrs,function(err,datas){
        if(err === 0){
            callback(0,datas);
        }else{
            callback(err,null);
        }
    });
};

//通用按字段查询count
/*********************************************
 * 简介:通用按字段查询count
 * string(tb_name)       要修改的表名
 * string(c_filed)       字段名
 * string(d_filed)       查询匹配的字段名
 * string(data)          查询匹配字段的值
 * function(callback)    回调函数
 *********************************************/
exports.select_count = function(tb_name,c_filed,d_filed,data,callback){
    //var s = c_filed+"s";
    var sqlselect = " select "+c_filed+" , count("+c_filed+") from "+ tb_name;
    if(d_filed){
        sqlselect+= " where "+d_filed+" = "+data+" group by "+c_filed;
    }else{
        sqlselect+=" group by "+c_filed;
    }
    db.insert(null,sqlselect,function(err,data){
        if(err === 0){
            callback(0,data);
        }else{
            callback(err,null);
        }
    });
};

//通用查询类复杂多条件带排序带分页方法
/*********************************************
 * 简介:通用查询类复杂条件带排序带分页方法
 * string(tb_name)       要查询的表名（必选）
 * string(c_filed)       要查询的字段集合（可选）
 * array(d_filed)        查询匹配的字段名集合（可选）
 * array(data)           查询匹配的值集合（可选）
 * string(code)          排序条件（可选）
 * array(data)           排序类型（可选）
 * int(page)             当前第几页（可选，默认为1）
 * int(num)              每页共几条（可选，默认为10）
 * function(callback)    回调函数（必选）
 *********************************************/
exports.select_data_much = function(tb_name,c_filed,d_filed,data,code,lift,page,num,callback){
    c_filed = c_filed?c_filed:"*";
    var str = '';
    if(d_filed && d_filed.length > 0){
        for(var i=0;i<d_filed.length;i++){
            if(typeof(data[i]) != "undefined"){
                for(var j= 0;j<data[i].length;j++){
                    if(i==0 && j==0){
                        str += " where ";
                    }else {
                        if(i>i-1){
                            str += " and ";
                        }

                    }
                    str += d_filed[i] + " in (" +JSON.stringify(data[i][j])+")";
                }
            }
        }
    }
    console.log(str);
    var sqlselect = " SELECT "+ c_filed +" FROM "+ tb_name;
    if(str){
        sqlselect += str;
    }
    if(code){
        sqlselect += " order by "+code+" "+lift;
    }
    if(page > 1){
        page = (page - 1)*num;
        sqlselect += " limit " +  page + ","+num
    }

    db.insert(null,sqlselect,function(err,data){
        if(err === 0){
            callback(0,data);
        }else{
            callback(err,null);
        }
    });
};
