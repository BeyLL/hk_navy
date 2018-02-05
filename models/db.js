var mysql = require('mysql');
var pool = mysql.createPool({
    //host: '169.11.96.28',
    //user: 'admin',
    //password: 'admin',
    //database: 'zk',
    //port:3306
    host: '192.168.1.200',
    user: 'admin',
    password: 'admin',
    database: 'hktrain',
    port:3306
});

pool.on('connection', function(connection) {
    connection.query('SET SESSION auto_increment_increment=1');
});

exports.insert = function(data,sql,cb){
    pool.getConnection(function (err,connection) {
        connection.query(sql,data,function(err,reslet){
            if(err){
                cb(err,null);
            }else{
                cb(0,reslet);
            }
            connection.release();
        });
    });
};


