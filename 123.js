/**
 * Created by Administrator on 2017/11/23.
 */
var getData = require('../models/dbsql');
var db = require("./models/db");
// var os=require('os'),
//     iptable={},
//     ifaces=os.networkInterfaces();
// var hostname=os.hostname();
// console.log(hostname);
// for (var dev in ifaces) {
//     ifaces[dev].forEach(function(details,alias){
//         if (details.family=='IPv6') {
//             iptable[dev+(alias?':'+alias:'')]=details.address;
//         }
//     });
// }
// console.log(iptable.本地连接);

var sqlStrs = "mysqldump -uroot -p123456 hktrain > D:/987.sql";
db.insert(null,sqlStrs,function(err,datas){
    if(err === 0){
        callback(0,datas);
    }else{
        callback(err,null);
    }
});