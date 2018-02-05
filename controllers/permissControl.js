/**
 * Created by Administrator on 2018/1/9.
 */
var db = require('../models/db');
var getData = require('../models/dbsql');
var permiss = require('../controllers/permissControl');
/**
 * 校验用户操作权限
 * 根据URL判断当前用户有无权限
 *
 * @param  {[type]}   actionUrl [req.url]
 * @param  {[type]}   userId    [userId]
 * @param  {[type]}   userType  [pc|mobile]
 * @param  {Function} callback  [description]
 * @return {[type]}             [description]
 */
exports.checkUserPermissionByName=function( req, res) {
    // var NOPERMISSION = false;
    // var OKPERMISSION = true;
    var body =req.body;
    var user = body.user || -1;
    var token = body.token || -1;
    try {
        if(user == -1 || token == -1 ){
            res.json({"code":300,"msg":"参数错误"});
        }else{
            permiss.checkMobile2Token(user,token,function (date) {
                if(date){
                    var sql = "select ra.* ,a.id,a.action_name ";
                    sql += "from t_role_action ra, t_action a, t_user u";
                    sql += " where ra.role_id = u.role_id and ra.action_id = a.id ";
                    sql += " and u.name = ? ";
                    var dataArr = [user];
                    db.insert( dataArr,sql, function(err, rows) {
                        if (err) {
                            console.log(err.message);
                            res.json({"code":400,"msg":"没有相应权限"});
                        } else {
                            if (rows.length > 0) {
                                //更新用户的lastLoginTime
                                var timestamp = new Date().getTime();
                                db.insert("update user set lastLoginTime=? where lastLoginTime>? ",
                                    [timestamp,0],
                                    function(err, result){
                                        res.json({"code":0,"msg":"查询成功","data":rows});
                                    });
                            } else {
                                res.json({"code":400,"msg":"没有相应权限"});
                            }
                        }
                    });
                }else{
                    res.json({"code":300,"msg":"用户未登录"});
                }
            })
        }
    } catch (e) {
        console.log(e);
        //callback(NOPERMISSION,null);
        res.json({"code":300,"msg":"未知错误"});
    }
}


exports.permissionDenied = function(res){
    res.json({
        "code": 201,
        "data": {
            "status": "fail",
            "error": "没有相应权限"
        }
    });
}

//验证账号和token是否匹配
exports.checkMobile2Token = function(user, token, callback) {
   getData.select_data("t_user",null,"name",user,"token",token,function (err,result) {
           if(err){
               console.log(err);
               callback(false)
           } else {
               if (result.length> 0) {
                   callback(true);
               } else {
                   callback(false);
               }
           }
   })

}