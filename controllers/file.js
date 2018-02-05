var fs = require('fs');
var formidable = require('formidable');
var uploadBaseURL = require('../models/pathCionfig');
var permiss = require('../controllers/permissControl');

/************************* 文件上传 ************************************/

/**
 * 多文件或单文件上传(form表单自动检测)
 * @param postfix  文件后缀名
 * @param callback 返回路径
 */
exports.uploadOfForm = function (req,callback) {
    // var videoType = ["avi","rmvb","rm","asf","divx","mpg","mpeg","mpe","wmv","mp4","mkv","vob"];
    // var imgType = ["jpg","JPG","jpeg","JPEG","png","PNG","bmp","BMP"];
    var form = new formidable.IncomingForm();
    form.encoding = 'utf-8'
    form.keepExtensions = true //保留后缀名
    // if(videoType.indexOf(postfix) != -1){
    //     form.uploadDir = "./public/upload/video" //视频上传路径
    // }else if(imgType.indexOf(postfix) != -1){
    //     form.uploadDir = "./public/upload/img" //图片上传路径
    // }else{
    //     form.uploadDir = "./public/upload/files" //文件上传路径
    // }
    form.uploadDir = "./public/upload/files" //文件上传路径
    form.multiples = true; //多图上传
    var files = []
    form.on('file', function (filed, file) {
        files.push([filed, file]);
    })
    form.parse(req, function (err, fields, files) {
        console.log(fields)
        var paths = []
        if (typeof(files.upload.length) === "undefined") {
            let path = files.upload.path.replace(/public/g, '')
            path = uploadBaseURL + path.replace(/\\/g, '/')
            paths.push(path)
            //callback({code:0,path:paths});
            res.json({"code":0,"msg":"上传成功","path":paths})
        } else {
            for (let i = 0; i < files.upload.length; i++) {
                let path = files.upload[i].path.replace(/public/g, '')
                path = uploadBaseURL + path.replace(/\\/g, '/')
                paths.push(path)
            }
            //callback({code:0,path:paths});
            res.json({"code":0,"msg":"上传成功","path":paths})
        }
    })
}

/**
 * 单文件上传
 * @param req
 * @param res
 */
exports.uploadSingle = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    console.log(req);
    try {
        var videoType = ["avi","rmvb","rm","asf","divx","mpg","mpeg","mpe","wmv","mp4","mkv","vob"];
        var imgType = ["jpg","JPG","jpeg","JPEG","png","PNG","bmp","BMP"];
        var file = req.files.file;
        console.log(file);
        var size = file.size;
        var path = file.path;
        var name = file.name;
        var type = file.type;
        var postfix = name.split(".")[name.split(".").length - 1];
        console.log("########");
        console.log(path);
        console.log(name);
        console.log("@@@@@@@@")
        if(videoType.indexOf(postfix) != -1){
            var target = "./public/upload/video" //视频上传路径
        }else if(imgType.indexOf(postfix) != -1){
            var target = "./public/upload/img" //图片上传路径
        }else{
            var target = "./public/upload/files" //文件上传路径
        }
        var timestamp = new Date().getTime();
        var target_path = target + timestamp + "." + postfix;
        console.log(path);
        fs.rename(path, target_path, function(err) {
            if (err) {
                console.log('rename error');
                console.log(err);
            } else {
                // 删除临时文件
                fs.unlink(path, function() {
                    if (err) {
                        console.log("删除临时文件错误");
                        console.log(err);
                    } else {
                        var url = uploadBaseURL + timestamp + "." + postfix;
                        res.json({ "code": 0, "msg":"上传成功","data":{"path":url,"fileName":name} });
                    }
                });
            }
        });
    }catch (e){
        console.log(e);
        res.json({"code":200,"msg":"未知错误"});
    }
}

/**
 * 多文件上传
 * @param req
 * @param res
 */
exports.uploadMulti = function (req,res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    var query = req.body;
    var user = query.user || -1;
    var token = query.token || -1;
    try {
        if(user == -1 || token == -1){
            res.json({"code":200,"msg":"参数错误"});
        }else {
            permiss.checkMobile2Token(user,token,function (date) {
                if(date){
                    var videoType = ["avi","rmvb","rm","asf","divx","mpg","mpeg","mpe","wmv","mp4","mkv","vob"];
                    var imgType = ["jpg","JPG","jpeg","JPEG","png","PNG","bmp","BMP"];
                    var files = req.files;
                    var urls = [];
                    var fileNames = [];
                    var timestamp = new Date().getTime();
                    for(var i in files){
                        var file = files[i];
                        var size = file.size;
                        var path = file.path;
                        var name = file.name;
                        var type = file.type;
                        var postfix = name.split(".")[name.split(".").length - 1];
                        if(videoType.indexOf(postfix) != -1){
                            var target = "./public/upload/video" //视频上传路径
                        }else if(imgType.indexOf(postfix) != -1){
                            var target = "./public/upload/img" //图片上传路径
                        }else{
                            var target = "./public/upload/files" //文件上传路径
                        }
                        var target_path = target + timestamp + "_" + i + "." + postfix;
                        urls.push(uploadBaseURL + timestamp + "_" + i + "." + postfix);
                        fileNames.push(name);
                        moveFile(path,target_path);
                    }
                    res.json({ "code": 0, "msg":"上传成功","data":{"paths":urls,"fileNames":fileNames}});
                }else{
                    res.json({"code":200,"msg":"用户未登录"});
                }
            })
        }
    }catch (e){
        console.log(e);
        res.json({"code":200,"msg":"未知错误"});
    }
}

function moveFile(path,target_path){
    fs.rename(path, target_path, function(err) {
        if (err) {
            console.log('rename error');
            console.log(err);
        } else {
            // 删除临时文件
            fs.unlink(path, function() {
                if (err) {
                    console.log("删除临时文件错误");
                    console.log(err);
                }
            });
        }
    });
}

/**
 * 通用上传方法(用于成绩、人员等的导入操作，只能导入Excel表格)
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