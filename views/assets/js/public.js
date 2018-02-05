/**
 * Created by nealZhang on 2018/1/22.
 */
var obj = readData("USER_KEY");
var user = obj.name;
var token = obj.token;


var $hi = $(".header");
$hi.before($("<div></div>").html("hi," + user).css({
    "position": "absolute",
    "right": "60px",
    "top": "21px",
    "color": "#fff",
    "font-size": "18px"
}));

var $oli;
var bt;

//获取所有的单位
getAllList()
var $
function getAllList(){
    $.ajax({
        url:"/getAllUnit",
        type:"POST",
        success:function(res){
            if(res.code==0){
                var data = res.row;
                var $right = $("#search .search_first .search_right");
                var $rig  = $("#search .search_second .search_right");
                for(var i=0;i<data.length;i++){
                    if(data[i].pid==1){
                        $right.append($("<span></span>").append(data[i].name+""));
                    }else if(data[i].pid==2){
                        $rig.append($("<span></span>").append(data[i].name+""));
                    }
                }
            }
        }
    })
}








//登录人信息
function getrole() {
    var data = {};
    data.user = readData("USER_KEY").name;
    data.token = readData("USER_KEY").token;
    data = JSON.stringify(data);
    $.ajax({
        url: "/getUnit",
        type: "post",
        dataType: "json",
        async: false,
        headers: {'Content-Type': 'application/json'},
        data: data,
        timeOut: 10000,
        success: function (data) {
            console.log(data);
            if (data.code == 0) {
                var res = data.row[0];
                getFirstUnit(res.id)
            } else {
                win.alert("提示", data.msg);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
        }
    })
}
getrole();
var $ul = $("#stair");
var id;
var first;
var sec;
var bt = true;
var cli = 0;


//获取一级单
function getFirstUnit(id) {
    var data = {
        user: user,
        token: token,
        pid: id
    };
    $.ajax({
        url: "/getfirstUnit",
        type: "POST",
        data: data,
        success: function (result) {
            //获取到的真实数据
            var res = result.row;
            if (res.length > 0) {
                for (var i = 0; i < res.length; i++) {
                    $ul.append($("<li></li>").addClass("" + res[i].id).append($("<a></a>").attr("href", "#").html("" + res[i].name)));
                }




                var $lis = $("#stair li");
                $lis.click(function () {
                    $this = $(this);
                    $(".detail .detail_left #top span").first().html($this.children().html() + "");
                    $(".detail .detail_left #secondary span").first().html("二级单位");
                    first = $this.attr("class");
                    pageNow = 1;
                    cli = 1;
                    var connect = window.location.href;
                    if (connect.indexOf('person.html') != -1) {
                        getUserList(parseFloat(first));  //  人员管理中获取人员列表
                        getSubUnit(parseFloat(first));   //  获得第三级单位  站或连
                        echart(undefined, parseFloat(first))   //图表切换，选取一级单位

                    } else if (connect.indexOf('score.html') != -1) {
                        bt = false;
                        getSroreList(parseFloat(first));
                        getSubUnit(parseFloat(first))
                    }
                })
            } else {
                $("#top span").first().html("一级单位")
            }

        }
    })

}

//
function getSubUnit(id) {
    var $ul1 = $("#second");
    $("#second").empty();
    var data = {
        user: user,
        token: token,
        pid: id
    };
    $.ajax({
        url: "/getfirstUnit",
        type: "POST",
        data: data,
        success: function (result) {
            //获取到的真实数据
            console.log(result);
            var res = result.row;
            if (res.length > 0) {
                for (var i = 0; i < res.length; i++) {
                    $ul1.append($("<li></li>").attr("class", "" + res[i].id).append($("<a></a>").attr("href", "#").html("" + res[i].name)));

                }
                var $lis = $("#second li");
                $lis.click(function () {
                    $this = $(this);
                    $(".detail .detail_left #secondary span").first().html($this.children().html() + "");
                    sec = $this.attr("class");
                    if (!bt) {
                        return;
                    }
                    pageNow = 1;
                    cli = 2;
                    getUserList(parseFloat(first), parseFloat(sec));
                    echart(undefined, undefined, parseFloat(sec));  //图表切换，获取二级单位
                })
            } else {
                $("#secondary span").first().html("二级单位");
            }

        }
    })
}


var flag = false,
    bg = 0;
function logout() {
    win.confirm('提示', '确认退出？', function (r) {
        if (r == true) {
            var data = {};
            data.user = readData("USER_KEY").name;
            data.token = readData("USER_KEY").token;
            data = JSON.stringify(data);
            console.log(data);
            $.ajax({
                url: "/userLoginout",
                type: "post",
                dataType: "json",
                async: false,
                headers: {'Content-Type': 'application/json'},
                data: data,
                timeOut: 10000,
                success: function (data) {
                    console.log(data);
                    if (data.code == 0) {
                        win.alert("提示", data.msg);
                        window.location.href = "index.html";
                    } else {
                        win.alert("提示", data.msg);
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log(errorThrown);
                }
            })
        } else {
            return false;
        }
    })
}

/*这个是表头权限*/
//获取展示的权限
getShow();
function getShow() {
    var obj = readData("USER_KEY");
    var user = obj.name;
    var token = obj.token;
    var id = obj.id;

    var data = {
        user: user,
        token: token,
        id: id
    };
    $.ajax({
        url: "/getRoleAction",
        type: "POST",
        data: data,
        success: function (result) {
            var res = result.data;
            var ary = [];
            for (var i = 0; i < res.length; i++) {
                ary.push(res[i].action_name)
            }
        }
    })
}

//根据相应的权限显示不同的框；
choiceBox();
function choiceBox() {
    var $as = $(".detail .choice li a");
    var array = [];
    for (var i = 0; i < $as.length; i++) {
        array.push($as.eq(i).html());

    }
}


//各个页面跳回首页
$(".introduce .foot").click(function () {
    window.location.href = 'shouye.html'
});


//切换选项卡
var $lis = $(".design .nav li");
$lis.click(function () {
    $this = $(this);
    $this.addClass("active").siblings().removeClass("active")
});

