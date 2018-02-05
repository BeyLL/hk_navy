/**
 * Created by Administrator on 2018/1/25.
 */
function cancel() {
    $("#unit_first option").eq(0).prop("selected",true);
    $("#unit_second option").eq(0).prop("selected",true);
    $("#ds_username").val("");
    $("#ds_userdate").val("");
    $("#ds_usernation option").eq(0).prop("selected",true);
    $("#ds_userculture option").eq(0).prop("selected",true);
    $("#ds_usermajor").eq(0).prop("selected",true);
    $("#ds_userface option").eq(0).prop("selected",true);
    $("#ds_usernative").val("");
    $("#ds_usercoach").val("");
    $("#ds_userremark").val("");
}

function baocun() {
    var data = {};
    data.unit_first = $("#unit_first option:selected").val();
    data.unit_second = $("#unit_second option:selected").val();
    data.name = $("#ds_username").val();
    if($("#ds_user").is(':checked') == true){
        data.sex = "女";
    }else if($("#ds_usersex").is(':checked') ==true){
        data.sex ="男";
    }
    data.brith_day = $("#ds_userdate").val();
    data.nation = $("#ds_usernation option:selected").html();
    data.education = $("#ds_userculture option:selected").html();
    data.person_type = $("#ds_usermajor option:selected").html();
    data.political_visage = $("#ds_userface option:selected").html();
    data.origin_place = $("#ds_usernative").val();
    data.address = $("#ds_usercoach").val();
    data.remark = $("#ds_userremark").val();
    if(data.unit_first==""){
        win.alert("提示","一级单位不能为空");
        return;
    }
    if(data.unit_second==""){
        win.alert("提示","二级单位不能为空");
        return;
    }
    if(data.name==""){
        win.alert("提示","姓名不能为空");
        return;
    }
    if($("#ds_user").is(':checked') == false && $("#ds_usersex").is(':checked') ==false){
        win.alert("提示","请勾选性别");
        return;
    }
    if(data.brith_day==""){
        win.alert("提示","出生日期不能为空");
        return;
    }
    if(data.nation==""){
        win.alert("提示","民族不能为空");
        return;
    }
    if(data.person_type==""){
        win.alert("提示","人员类型不能为空");
        return;
    }
    var datas = {};
    datas.data =data;
    datas.user = readData("USER_KEY").name;
    datas.token = readData("USER_KEY").token;
    datas = JSON.stringify(datas);
    $.ajax({
        url: "/add_people",
        type: "post",
        dataType: "json",
        async: false,
        headers: {'Content-Type': 'application/json'},
        data: datas,
        timeOut: 10000,
        success: function (data) {
            console.log(data);
            if (data.code == 0) {
                win.alert('提示', data.msg);
            } else {
                win.alert('提示', data.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
        }
    })

}
//获取一级单位
getunits();
function getunits() {
    $.ajax({
        url: "/getfirstUnit",
        type: "post",
        dataType: "json",
        // async:false,
        data: {
            user:readData('USER_KEY').name,
            token:readData('USER_KEY').token,
            pid:1,
        },
        timeOut: 10000,
        success: function (data) {
            console.log(data);
            if (data.code == 0) {
                $("#unit_first").html(getunitHtml(data.row));
            } else {
                win.alert("提示",data.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
        }
    })
}
//根据一级单位获取二级单位
function getsecondunit() {
    $.ajax({
        url: "/getfirstUnit",
        type: "post",
        dataType: "json",
        data: {
            user:readData('USER_KEY').name,
            token:readData('USER_KEY').token,
            pid:$("#unit_first option:selected").val(),
        },
        timeOut: 10000,
        success: function (data) {
            console.log(data);
            if (data.code == 0) {
                $("#unit_second").html(getunitHtml(data.row));
            } else {
                win.alert("提示",data.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
        }
    })
}
//获取人员图表查询类型
getType();
function getType() {
    $.ajax({
        url: "/getPeopleType",
        type: "post",
        dataType: "json",
        data: {
            user:readData('USER_KEY').name,
            token:readData('USER_KEY').token
        },
        timeOut: 10000,
        success: function (data) {
            console.log(data);
            if (data.code == 0) {
                $("#filed").html(getTypeHtml(data.row));
            } else {
                win.alert("提示",data.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
        }
    })
}

function find() {
    var data={};
    if($("#unit option:selected").html() =="全旅"){
        data.unit_frist = "";
        data.unit_second = "";
    }else{
        data.unit_frist = $("#unit_first option:selected").val();
        data.unit_second = $("#unit_second option:selected").val();
    }
    data.user = readData('USER_KEY').name;
    data.token = readData('USER_KEY').token;
    data.condition = $("#filed option:selected").val();
    var settings = {
        "url":"/diplay_chart",
        "method": "POST",
        "data":data,
    };
    $.ajax(settings).done(function (date) {
        console.log(date);
        if (date.code==0){
            console.log(date.row)
        }else{
            alert(date.msg);
        }
    });
}