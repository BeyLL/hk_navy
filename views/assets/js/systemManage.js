
//系统管理模块的选项卡切换
var $olis = $(".design .nav li");
var $per = $(".system .personList");
var $btn = $(".design div");
$olis.click(function(){
    $this = $(this);
    var index = $olis.index($this);
    $btn.eq(index).addClass("perMiss").siblings().removeClass("perMiss");
    $per.eq(index).addClass("perMiss").siblings().removeClass("perMiss");
});

/******************************** 用户管理 start *****************************************/
//全选功能
function allcheck() {
    if ($('#allcheck').is(':checked') == true) {
        $('#userList input[type=checkbox]').prop('checked', true);
    } else if ($('#allcheck').is(':checked') == false) {
        $('#userList input[type=checkbox]').prop('checked', false);
    }
}

var user_pageNow=1;
var user_pageSum;
var user_pagesize=10;
getUserList();
//分页查询用户
function getUserList() {
    var settings = {
        "url":"getUser",
        "method": "POST",
        "async":"false",
        "data":{
            user:readData('USER_KEY').name,
            token:readData('USER_KEY').token,
            page:user_pageNow,
            pageSize:user_pagesize,
        }
    }
    $.ajax(settings).done(function (response) {
        if(response.code==0){
            var data=response.data;
            var html='';
            for(var i = 0;i<data.length;i++){
                if(user_pageNow==1){
                    var k=i+1;
                }else{
                    var k = parseInt((user_pageNow-1)*user_pagesize+i+1);
                }
                html+="<tr>"
                html+="<td style='font-size:14px;'><input class='check' type='checkbox' value='" + data[i].id + "'/></td>" +
                    "<td style='font-size:14px;width: 5%;'>"+k+"</td><td style='font-size:14px;width: 15%'>"+data[i].role_name+"</td>" +
                    "<td style='font-size:14px;width: 15%;'>"+data[i].name+"</td><td style='font-size:14px;width: 15%;'>"+data[i].card_id+"</td>" +
                    "<td style='font-size:14px;width: 15%;'>"+data[i].show_pass+"</td><td style='font-size:14px;width: 20%;'>"+data[i].email+"</td>" +
                    "<td style='font-size:14px;'><span class='label label-info' style='cursor: pointer;margin-right: 10px' onclick='editUser(" + data[i].id + ")''><i class='glyphicon glyphicon-edit'>&nbsp;</i>编辑</span>" +
                    "<span class='label label-danger' style='cursor: pointer;' onclick='delUser(" + data[i].id + ")''><i class='glyphicon glyphicon-remove'>&nbsp;</i>删除</span></td>"
                html+="</tr>"
            }
            if(user_pagesize != data.length){
                for(var j = 0;j<user_pagesize-data.length;j++){
                    html+="<tr style='height:37px;'></tr>";
                }
            }
            $('#userList').html(html);
            $('#user_tiaoshu').text(response.total)
            user_pageSum=response.total/user_pagesize;
            user_pageSum=Math.ceil(user_pageSum);
            var pageInSum=user_pageNow+"/"+user_pageSum
            $('#user_pageNum').text(pageInSum);
        } else {
            win.alert('提示',response.msg);
        }
    });
}

//初始化为第一页 获取用户列表
getUserList();
//第一页
function user_first(){
    if(user_pageNow==1){
        win.alert("提示","已是第一页");
        return;
    }
    user_pageNow=1;
    getUserList();
}
//上一页
function user_prevpage(){
    if(user_pageNow==1){
        win.alert("提示","已是第一页");
        return
    }
    user_pageNow--;
    getUserList();
}
//下一页
function user_nextpage(){
    if(user_pageNow==user_pageSum){
        win.alert("提示","已是最后一页");
        return;
    }
    user_pageNow++;
    getUserList();
}
//最后一页
function user_last(){
    if(user_pageNow==user_pageSum){
        win.alert("提示","已是最后一页");
        return;
    }
    user_pageNow=user_pageSum;
    getUserList();
}
//按页数查询
function user_selectByPage(){
    if($('#ty').val()==''){
        user_pageNow=1;
        getUserList();
        return;
    }else if($('#user_ty').val()<1||$('#user_ty').val()>user_pageSum){
        win.alert('提示','输入页数为正数且不能大于'+user_pageSum);
        $('#user_ty').val('');
        return;
    }else{
        user_pageNow=$('#user_ty').val();
        getUserList();
        return;
    }
}
//选中默认每页条数查询
function user_selectPageSize() {
    for (var i = 0; i < $('#pagesize option').length; i++) {
        if ($('#pagesize option').eq(i).is(':selected') == true) {
            pagesize = $('#pagesize option').eq(i).val();
            user_selectByPage();
        }
    }
}
//编辑弹框
function editUser(id) {
    var settings = {
        "url": "/getSingleUser",
        "method": "POST",
        "async": false,
        "data": {
            user: readData('USER_KEY').name,
            token: readData('USER_KEY').token,
            id: id,
        }
    }
    $.ajax(settings).done(function (response) {
        console.log(response);
        if (response.code == 0) {

        } else {
            win.alert("提示", response.msg);
        }
    });
}
//删除
function delUser(id) {
    win.confirm('提示','确认删除后无法恢复',function (r) {
        if(r == true){
            var settings = {
                "url": "/delUser",
                "method": "POST",
                "async": false,
                "data": {
                    user: readData('USER_KEY').name,
                    token: readData('USER_KEY').token,
                    id: id,
                }
            }
            $.ajax(settings).done(function (response) {
                console.log(response);
                if (response.code == 0) {
                    win.alert("提示", response.msg);
                    getUserList();
                } else {
                    win.alert("提示", response.msg);
                }
            });
        }else{
            return false;
        }
    })
}
//批量删除
$('#user_delAll').click(function () {
    var date=[];
    for (var i = 0; i < $('#userList input[type=checkbox]').length; i++) {
        if ($('#userList input[type=checkbox]').eq(i).is(':checked') == true) {
            date.push($('#userList input[type=checkbox]').eq(i).val());
        }
    }
    if(date.length == 0){
        win.alert('提示','请勾选要删除的用户');
    }else{
        win.confirm('提示','确认删除后无法恢复',function (r) {
            if(r == true){
                var settings = {
                    "url": "/delete_user",
                    "method": "POST",
                    "async": false,
                    "data": {
                        user: readData('USER_KEY').name,
                        token: readData('USER_KEY').token,
                        id: JSON.stringify(date),
                    }
                }
                $.ajax(settings).done(function (response) {
                    console.log(response);
                    if (response.code == 0) {
                        win.alert("提示", response.msg);
                        getUserList();
                    } else {
                        win.alert("提示", response.msg);
                    }
                });
            }else{
                return false;
            }
        })
    }
})

/******************************** 用户管理 end *******************************************/

/******************************** 权限管理 start *****************************************/
var action_pageNow=1;
var action_pageSum;
var action_pagesize=10;

//   获取角色名称
function getRole() {
    var settings = {
        "url":"getRole",
        "method": "POST",
        "async":"false",
        "data":{
            user:readData('USER_KEY').name,
            token:readData('USER_KEY').token,
            page:action_pageNow,
            pageSize:action_pagesize,
        }
    }
    //alert(settings.data.page);
    $.ajax(settings).done(function (response) {
        if(response.code == 0){
            var data = response.data;
            sessionStorage.setItem('getRole',JSON.stringify(data));
            $('#action_tiaoshu').text(response.total)
            action_pageSum=response.total/action_pagesize;
            action_pageSum=Math.ceil(action_pageSum);
            var pageInSum=action_pageNow+"/"+action_pageSum
            $('#action_pageNum').text(pageInSum);
        }else{
            win.alert('提示',response.msg)
        }
    })
}
getRole()
//    获取全部权限
function getAction() {
    var settings = {
        "url":"getAction",
        "method": "POST",
        "async":"false",
        "data":{
            user:readData('USER_KEY').name,
            token:readData('USER_KEY').token,
        }
    }
    $.ajax(settings).done(function (response) {
        if(response.code == 0){
            var data = response.data;
            sessionStorage.setItem('getAction',JSON.stringify(data));
        }else{
            win.alert('提示',response.msg)
        }
    });
}
getAction()
//  获取角色权限
function getActionList() {
    var html='';
    var data;
    var getRole = JSON.parse(sessionStorage.getItem('getRole'));
    var getAction = JSON.parse(sessionStorage.getItem('getAction'));
    for (var i = 0; i < getRole.length; i++) {
        html+="<tr id='tr"+getRole[i].id+"'><td>"+(i+1)+"</td><td>"+getRole[i].role_name+"</td><td>"
        for(var j=0;j<getAction.length;j++){
            html+="<input id='in"+getAction[j].id+"' type='checkbox' value='"+getAction[j].id+"' /><span style='margin-right: 15px;'>"+getAction[j].action_name+"</span>"
        }
        html+="</td><td style='font-size:14px;'><span class='label label-info' style='cursor: pointer;margin-right: 10px' onclick='bianji(" + getRole[i].id + ")''><i class='glyphicon glyphicon-edit'>&nbsp;</i>编辑</span>" +
            "<span class='label label-danger' style='cursor: pointer;' onclick='shanchu(" + getRole[i].id + ")''><i class='glyphicon glyphicon-remove'>&nbsp;</i>删除</span></td></tr>";
    }
    if(action_pagesize != getRole.length){
        for(var j = 0;j<action_pagesize-getRole.length;j++){
            html+="<tr style='height:37px;'></tr>";
        }
    }
    $('#actionList').html(html);
    for(var j = 0; j < getRole.length; j++){
        var settings = {
            "url":"getRoleAction",
            "method": "POST",
            "async":false,
            "data":{
                user:readData('USER_KEY').name,
                token:readData('USER_KEY').token,
                id:getRole[j].id
            }
        }
        $.ajax(settings).done(function (response) {
            if(response.code == 0){
                data = response.data;
                for(var l = 0;l<getAction.length;l++){
                    for(var k=0;k<data.length;k++){
                        if(getAction[l].id == data[k].id){
                            $("#tr"+getRole[j].id).find('#in'+getAction[l].id).prop('checked',true);
                        }
                    }
                }

            }else{
                win.alert('提示',response.msg)
            }
        });
    }
}
getActionList()
getRole();
getAction();
getActionList();
//第一页
function action_first(){
    if(action_pageNow==1){
        win.alert("提示","已是第一页");
        return;
    }
    action_pageNow=1;
    getRole();
    getAction();
    getActionList();
}
//上一页
function action_prevpage(){
    if(action_pageNow==1){
        win.alert("提示","已是第一页");
        return
    }
    action_pageNow--;
    getRole();
    getAction();
    getActionList();
}
//下一页
function action_nextpage(){
    if(action_pageNow==action_pageSum){
        win.alert("提示","已是最后一页");
        return;
    }
    action_pageNow++;
    getRole();
    getAction();
    getActionList();
}
//最后一页
function action_last(){
    if(action_pageNow==action_pageSum){
        win.alert("提示","已是最后一页");
        return;
    }
    action_pageNow=action_pageSum;
    getRole();
    getAction();
    getActionList();
}
//按页数查询
function action_selectByPage(){
    if($('#action_ty').val()==''){
        action_pageNow=1;
        getRole();
        getAction();
        getActionList();
        return;
    }else if($('#action_ty').val()<1||$('#action_ty').val()>pageSum){
        win.alert('提示','输入页数为正数且不能大于'+pageSum);
        $('#action_ty').val('');
        return;
    }else{
        action_pageNow=$('#action_ty').val();
        getRole();
        getAction();
        getActionList();
        return;
    }
}
//选中默认每页条数查询
function action_selectPageSize() {
    for (var i = 0; i < $('#action_pagesize option').length; i++) {
        if ($('#action_pagesize option').eq(i).is(':selected') == true) {
            action_pagesize = $('#action_pagesize option').eq(i).val();
            action_selectByPage();
        }
    }
}
/******************************** 权限管理 end *******************************************/

/******************************** 日志管理 start *****************************************/
var pageNow=1;
var pageSum;
var pagesize=10;
getLogsList();
//分页查询日志
function getLogsList() {
    var settings = {
        "url":"getLog",
        "method": "POST",
        "async":"false",
        "data":{
            user:readData('USER_KEY').name,
            token:readData('USER_KEY').token,
            page:pageNow,
            pageSize:pagesize,
        }
    }
    $.ajax(settings).done(function (response) {
        if(response.code==0){
            var data=response.data;
            var html='';
            for(var i = 0;i<data.length;i++){
                if(pageNow==1){
                    var k=i+1;
                }else{
                    var k = parseInt((pageNow-1)*pagesize+i+1);
                }
                html+="<tr>"
                html+="<td style='font-size:14px;width: 5%;'>"+k+"</td><td style='font-size:14px;width: 15%'>"+data[i].name+"</td>" +
                    "<td style='font-size:14px;width: 15%;'>"+data[i].type+"</td>" +
                    "<td style='font-size:14px;width: 15%;'>"+data[i].operate+"</td><td style='font-size:14px;width: 25%;'>"+getMyDate(data[i].create_time)+"</td>"
                html+="</tr>"
            }
            if(pagesize != data.length){
                for(var j = 0;j<pagesize-data.length;j++){
                    html+="<tr style='height:37px;'></tr>";
                }
            }
            $('#logList').html(html);
            $('#log_tiaoshu').text(response.total)
            pageSum=response.total/pagesize;
            pageSum=Math.ceil(pageSum);
            var pageInSum=pageNow+"/"+pageSum
            $('#log_pageNum').text(pageInSum);
        } else {
            win.alert('提示',response.msg);
        }
    });
}

//初始化为第一页 获取日志列表
getLogsList();
//第一页
function first(){
    if(pageNow==1){
        win.alert("提示","已是第一页");
        return;
    }
    pageNow=1;
    getLogsList();
}
//上一页
function prevpage(){
    if(pageNow==1){
        win.alert("提示","已是第一页");
        return
    }
    pageNow--;
    getLogsList();
}
//下一页
function nextpage(){
    if(pageNow==pageSum){
        win.alert("提示","已是最后一页");
        return;
    }
    pageNow++;
    getLogsList();
}
//最后一页
function last(){
    if(pageNow==pageSum){
        win.alert("提示","已是最后一页");
        return;
    }
    pageNow=pageSum;
    getLogsList();
}
//按页数查询
function selectByPage(){
    if($('#log_ty').val()==''){
        pageNow=1;
        getLogsList();
        return;
    }else if($('#log_ty').val()<1||$('#log_ty').val()>pageSum){
        win.alert('提示','输入页数为正数且不能大于'+pageSum);
        $('#log_ty').val('');
        return;
    }else{
        pageNow=$('#log_ty').val();
        getLogsList();
        return;
    }
}
//选中默认每页条数查询
function selectPageSize(){
    for(var i=0;i<$('#log_pagesize option').length;i++){
        if($('#log_pagesize option').eq(i).is(':selected') == true){
            pagesize = $('#log_pagesize option').eq(i).val();
            selectByPage();
        }
    }
}

/******************************** 日志管理 end *****************************************/

//转换时间
function getMyDate(timeStamp) {
    var newDate = new Date();
    newDate.setTime(timeStamp);
    Date.prototype.pattern=function(fmt) {
        var o = {
            "M+" : this.getMonth()+1, //月份
            "d+" : this.getDate(), //日
            "h+" : this.getHours(), //小时
            "H+" : this.getHours(), //小时
            "m+" : this.getMinutes(), //分
            "s+" : this.getSeconds(), //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S" : this.getMilliseconds() //毫秒
        };
        var week = {
            "0" : "/u65e5",
            "1" : "/u4e00",
            "2" : "/u4e8c",
            "3" : "/u4e09",
            "4" : "/u56db",
            "5" : "/u4e94",
            "6" : "/u516d"
        };
        if(/(y+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        }
        if(/(E+)/.test(fmt)){
            fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
        }
        for(var k in o){
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            }
        }
        return fmt;
    }

    return newDate.pattern("yyyy-MM-dd hh:mm:ss");
};