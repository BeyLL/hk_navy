var province = [
    "北京市",
    "天津市",
    "河北省",
    "山西省",
    "内蒙古自治区",
    "辽宁省",
    "吉林省",
    "黑龙江省",
    "上海市",
    "江苏省",
    "浙江省",
    "安徽省",
    "福建省",
    "江西省",
    "山东省",
    "河南省",
    "湖北省",
    "湖南省",
    "广东省",
    "广西壮族自治区",
    "海南省",
    "重庆市",
    "四川省",
    "贵州省",
    "云南省",
    "西藏自治区",
    "陕西省",
    "甘肃省",
    "青海省",
    "宁夏回族自治区",
    "新疆维吾尔自治区",
    "台湾省",
    "香港特别行政区",
    "澳门特别行政区",
];

var nations = [
    "汉族",
    "蒙古族",
    "回族",
    "藏族",
    "维吾尔族",
    "苗族",
    "彝族",
    "壮族",
    "布依族",
    "朝鲜族",
    "满族",
    "侗族",
    "瑶族",
    "白族",
    "土家族",
    "哈尼族",
    "哈萨克族",
    "傣族",
    "黎族",
    "傈僳族",
    "佤族",
    "畲族",
    "高山族",
    "拉祜族",
    "水族",
    "东乡族",
    "纳西族",
    "景颇族",
    "柯尔克孜族",
    "土族",
    "达斡尔族",
    "仫佬族",
    "羌族",
    "布朗族",
    "撒拉族",
    "毛南族",
    "仡佬族",
    "锡伯族",
    "阿昌族",
    "普米族",
    "塔吉克族",
    "怒族",
    "乌孜别克族",
    "俄罗斯族",
    "鄂温克族",
    "德昂族",
    "保安族",
    "裕固族",
    "京族",
    "塔塔尔族",
    "独龙族",
    "鄂伦春族",
    "赫哲族",
    "门巴族",
    "珞巴族",
    "基诺族"
];

var education = [
    "小学",
    "初中",
    "高中",
    "中专",
    "大专",
    "本科",
    "硕士",
    "博士"
];

var field = [
    "性别",
    "人员类型",
    "文化程度",
    "民族",
    "政治面貌",
    "籍贯",
    "特长",
    "是否单亲",
    "是否独生",
];
/*------------------筛选查询--------------------*/
//筛选查询的显示与隐藏切换
var $query = $(".query_left");
var $search = $(".show_search");
var $right_hide = $(".query_right")
var sea = false;
$query.click(function () {
    if (!sea) {
        $search.css("display", "block");
        $right_hide.removeClass("right_hide");
        $(".query_left .glyphicon").removeClass("glyphicon glyphicon-triangle-bottom").addClass("glyphicon glyphicon-triangle-top")
        sea = true;
    } else {
        $search.css("display", "none");
        $right_hide.addClass("right_hide")
        $(".query_left .glyphicon").removeClass("glyphicon glyphicon-triangle-top").addClass("glyphicon glyphicon-triangle-bottom")
        sea = !sea;
    }

});
//点击更多
var $more = $("#search .search_end");
var query = false;
$more.click(function () {
    $this = $(this);
    if (!query) {
        $this.parent().children(".search_right").css("overflow", "visible");
        $this.children("span").removeClass("iconfont icon-down").addClass("glyphicon glyphicon-menu-up")
        query = true;
    } else {
        $this.parent().children(".search_right").css("overflow", "hidden");
        $this.children("span").removeClass("glyphicon glyphicon-menu-up").addClass("  iconfont icon-down")
        query = !query;
    }
});

/*-----------        -----------*/
$("#chart").attr("display", "none");
//全选功能
function allcheck() {
    if ($('#allcheck').is(':checked') == true) {
        $('#userList input[type=checkbox]').prop('checked', true);
    } else if ($('#allcheck').is(':checked') == false) {
        $('#userList input[type=checkbox]').prop('checked', false);
    }
}
//批量删除
$('#delAll').click(function () {
    var datas = [];
    for (var i = 0; i < $('#userList input[type=checkbox]').length; i++) {
        if ($('#userList input[type=checkbox]').eq(i).is(':checked') == true) {
            datas.push($('#userList input[type=checkbox]').eq(i).val());
        }
    }
    if (datas.length == 0) {
        win.alert('提示', '请勾选要删除的人员');
    } else {
        var settings = {
            "url": "/delete_people",
            "method": "POST",
            "async": false,
            "data": {
                user: readData('USER_KEY').name,
                token: readData('USER_KEY').token,
                id: JSON.stringify(datas),
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
    }
});
//动态生成筛选搜索
var $na = $("#search .national .search_right");
for (var i = 0; i < nations.length; i++) {
    $na.append($("<span></span>").append($("<input />").attr("type", "checkbox")).append("" + nations[i]))
}

var $ed = $("#search .education .search_right");
for (var i = 0; i < education.length; i++) {
    $ed.append($("<span></span>").append($("<input />").attr("type", "checkbox")).append("" + education[i]))
}

var $pro = $("#search .province .search_right");
for (var i = 0; i < province.length; i++) {
    $pro.append($("<span></span>").append($("<input/>").attr("type", "checkbox")).append("" + province[i]))
}
//筛选搜索传参方法

function input(ele){
    var $span = $("#search .search_right")
}






// search(["sex"],["女"]);
function search(fileds, value) {
    var user = obj.name,
        token = obj.token,

        datas = {
            user: user,
            token: token,
            filedArr:fileds,
            dataArr:value,
            page: 1,
            num:10,
            tb_name:"t_person"
        };


        $.ajax({
            url:"/pageWay",
            type:"POST",
            data:datas,
            success:function(result){
                if(result.code == 0){
                   var data = result.row;
                }
            }
        });
    console.log(user,token)
}

var pageNow = 1;
var pageSum;
var pagesize = 10;
//获取人员
function getUserList(firstId, secondId) {

    if (!firstId) {
        firstId = readData("USER_KEY").id
    }
    if (!secondId) {
        secondId = undefined;
    }
    var settings = {
        "url": "getPeople",
        "method": "POST",
        "async": false,
        "data": {
            user: readData('USER_KEY').name,
            token: readData("USER_KEY").token,
            unit_first: firstId,
            unit_second: secondId,
            page: pageNow,
            pageSize: pagesize,
        }
    };
    $.ajax(settings).done(function (response) {
        console.log(response);
        if (response.code == 0) {
            var attr = response.row;
            var data = response.data;
            var attrHtml = '';
            var html = '';
            for (var j = 0; j < attr.length; j++) {
                if (j == 0) {
                    attrHtml += " <th style='white-space: nowrap;font-size: 15px;'><input id='allcheck' onchange='allcheck()' type='checkbox'/></th>";
                    attrHtml += " <th style='white-space: nowrap;font-size: 15px;'>序号</th>";
                } else {
                    attrHtml += " <th style='white-space: nowrap;font-size: 15px;'>" + attr[j].attrValue + "</th>";
                }
                if (j == attr.length - 1) {
                    attrHtml += " <th style='white-space: nowrap;font-size: 15px;'>操作</th>";
                }
            }
            $('#attr').html(attrHtml);
            for (var i = 0; i < data.length; i++) {
                if (pageNow == 1) {
                    var k = i + 1;
                } else {
                    var k = parseInt((pageNow - 1) * pagesize + i + 1);
                }
                var attrname = data[i];
                for (key in attrname) {
                    html += '<tr>'
                    for (var l = 0; l < attr.length; l++) {
                        if (l == 0) {
                            html += "<td><input class='check' type='checkbox' value='" + attrname[attr[0].attrName] + "'/></td><td style='font-size:14px;white-space: nowrap;'>" + k + "</td>";
                        } else {
                            html += "<td style='font-size:14px;white-space: nowrap;'>" + attrname[attr[l].attrName] + "</td>";
                        }
                        if (l == attr.length - 1) {
                            html += "<td style='font-size:14px;'><span class='label label-info' style='cursor: pointer;margin-right: 10px' onclick='diaochu(" + attrname[attr[0].attrName] + ")''><i class='glyphicon glyphicon-edit'>&nbsp;</i>调出</span>" +
                                "<span class='label label-info' style='cursor: pointer;margin-right: 10px' onclick='bianji(" + attrname[attr[0].attrName] + ")''><i class='glyphicon glyphicon-edit'>&nbsp;</i>编辑</span>" +
                                "<span class='label label-danger' style='cursor: pointer;' onclick='shanchu(" + attrname[attr[0].attrName] + ")''><i class='glyphicon glyphicon-remove'>&nbsp;</i>删除</span></td>";
                        }
                    }
                    html += '</tr>';
                    break;
                }
//                    html+="<tr>"
//                    html+="<td style='font-size:14px;width: 4%;'>"+k+"</td><td style='font-size:14px;width: 5%'>"+data[i].unit_first+"</td>" +
//                        "<td style='font-size:14px;width: 5%;'>"+data[i].unit_second+"</td><td style='font-size:14px;width: 15%;'>"+data[i].name+"</td>" +
//                        "<td style='font-size:14px;width: 10%;'>"+data[i].sex+"</td><td style='font-size:14px;width: 7%;'>"+getMyDate(data[i].brith_day)+"</td>" +
//                        "<td style='font-size:14px;width: 7%;'>"+data[i].nation+"</td><td style='font-size:14px;width: 7%;'>"+data[i].education+"</td>" +
//                        "<td style='font-size:14px;width: 7%;'>"+data[i].evaluation+"</td><td style='font-size:14px;width: 15%;'>"+getMyDate(data[i].check_time)+"</td>" +
//                        "<td style='font-size:14px;width: 10%;'>"+data[i].remark+"</td>" +
//                        "<td style='font-size:14px;'><span class='label label-info' style='cursor: pointer;margin-right: 10px' onclick='bianji(" + data[i].id + ")''><i class='glyphicon glyphicon-edit'>&nbsp;</i>编辑</span>" +
//                        "<span class='label label-danger' style='cursor: pointer;' onclick='shanchu(" + data[i].id + ")''><i class='glyphicon glyphicon-remove'>&nbsp;</i>删除</span></td>"
//                    html+="</tr>"
            }
            if (pagesize != data.length) {
                for (var j = 0; j < pagesize - data.length; j++) {
                    html += "<tr style='height:37px;'></tr>";
                }
            }
            $('#userList').html(html);
            $('#tiaoshu').text(response.total)
            pageSum = response.total / pagesize;
            pageSum = Math.ceil(pageSum);
            var pageInSum = pageNow + "/" + pageSum
            $('#pageNum').text(pageInSum);
        } else {
            win.alert('提示', response.msg);
        }
    });
}
getUserList();

//第一页
function first() {
    if (pageNow == 1) {
        win.alert("提示", "已是第一页");
        return
    }
    pageNow = 1;
    getUserList();
}

//上一页
function prevpage() {
    if (pageNow == 1) {
        win.alert("提示", "已是第一页");
        return
    }
    pageNow--;
    getUserList();
}

//下一页
function nextpage() {

    if (pageNow == pageSum) {
        win.alert("提示", "已是最后一页");
        return
    }
    pageNow++;
    getUserList(parseFloat(obj));

}

//最后一页
function last() {
    if (pageNow == pageSum) {
        win.alert("提示", "已是最后一页");
        return
    }
    pageNow = pageSum;
    pagesize = 10;
    getUserList();
}

//按页数查询
function selectByPage() {
    if ($('#tys').val() == '') {
        pageNow = 1;
        getUserList();
    } else if ($('#tys').val() < 1 || $('#tys').val() > pageSum) {
        win.alert('提示', '输入页数为正数且不能大于' + pageSum);
        $('#tys').val('');
        return;
    } else {
        pageNow = $('#tys').val();
        getUserList();
        return;
    }

}


/*删除*/
function shanchu(id) {
    var DataArr = [id];
    win.confirm('提示', '确认删除删除后无法恢复', function (r) {
        if (r == true) {
            var settings = {
                "url": "/delete_people",
                "method": "POST",
                "data": {
                    user: readData("USER_KEY").name,
                    token: readData("USER_KEY").token,
                    id: JSON.stringify(DataArr),
                },
            };
            $.ajax(settings).done(function (response) {
                console.log(response);
                if (response.code == 0) {
                    win.alert("提示", response.msg);
                    getUserList()
                } else {
                    win.alert("提示", response.msg);
                }
            });
        } else {
            return false;
        }

    })
}

function diaochu(id) {


}
function bianji(id) {
    $(".box").css("display", "block");
    var settings = {
        "url": "/getfirstUnit",
        "method": "POST",
        "data": {
            user: readData("USER_KEY").name,
            token: readData("USER_KEY").token,
            pid: 1,
        },
    };
    $.ajax(settings).done(function (response) {
        console.log(response);
        if (response.code == 0) {
            var msgs = response.row;
            var html = "<option value=''></option>";
            for (var i = 0; i < msgs.length; i++) {
                html += "<option value='" + msgs[i].id + "'>" + msgs[i].name + "</option>"
            }
            $("#unit_first").html(html);
            var settings = {
                "url": "/getPeopleId",
                "method": "POST",
                "data": {
                    user: readData("USER_KEY").name,
                    token: readData("USER_KEY").token,
                    id: id,
                },
            };
            $.ajax(settings).done(function (datas) {
                if (datas.code == 0) {
                    var msg = datas.row;
                    ID = msg.id;
                    $("#unit_first").val(msg.unit_first);

                    $("#username").val(msg.name);
                    $("#card_id").val(msg.card_id);
                    $("#sex option:selected").html(msg.sex);
                    $("#person_type option:selected").html(msg.person_type);
                    $("#brith_day").val(msg.brith_day);
                    $("#education option:selected").html(msg.education);
                    $("#nation option:selected").html(msg.nation);
                    $("#political_visage option:selected").html(msg.political_visage);
                    $("#household option:selected").html(msg.household);
                    $("#origin_place ").val(msg.origin_place);
                    $("#specialty").val(msg.specialty);
                    $("#single_parent option:selected").html(msg.single_parent);
                    $("#address").val(msg.address);
                    $("#mobile").val(msg.mobile);
                    $("#remark").val(msg.remark);
                    $("#only_child option:selected").html(msg.only_child);
                    var settings = {
                        "url": "/getfirstUnit",
                        "method": "POST",
                        "data": {
                            user: readData("USER_KEY").name,
                            token: readData("USER_KEY").token,
                            pid: $("#unit_first option:selected").val(),
                        },
                    };
                    $.ajax(settings).done(function (data) {
                        if (data.code == 0) {
                            console.log(data);
                            var html = "<option value=''></option>";
                            for (var i = 0; i < data.row.length; i++) {
                                html += "<option value='" + data.row[i].id + "'>" + data.row[i].name + "</option>"
                            }
                            $("#unit_second").html(html);
                            $("#unit_second").val(msg.unit_second);
                        } else {
                            win.alert("提示", data.msg)
                        }

                    })
                } else {
                    win.alert("提示", response.msg);
                }
            });
        } else {
            win.alert("提示", response.msg);
        }
    });
}
//取消
function cancels() {
    $(".box").css("display", "none");
}
//保存
function keeps() {
    var data = {};
    data.unit_first = $("#unit_first").val();
    data.unit_second = $("#unit_second").val();
    data.name = $("#username").val();
    data.card_id = $("#card_id").val();
    data.sex = $("#sex option:selected").html();
    data.person_type = $("#person_type option:selected").html();
    data.brith_day = $("#brith_day").val();
    data.education = $("#education option:selected").html();
    data.nation = $("#nation option:selected").html();
    data.political_visage = $("#political_visage option:selected").html();
    data.household = $("#household option:selected").html();
    data.origin_place = $("#origin_place").val();
    data.specialty = $("#specialty").val();
    data.single_parent = $("#single_parent option:selected").html();
    data.address = $("#address").val();
    data.mobile = $("#mobile").val();
    data.remark = $("#remark").val();
    data.only_child = $("#only_child option:selected").html();
    if (data.unit_first == "") {
        win.alert("提示", "一级单位不能为空");
        return;
    }
    if (data.unit_second == "") {
        win.alert("提示", "二级单位不能为空");
        return;
    }
    if (data.name == "") {
        win.alert("提示", "姓名不能为空");
        return;
    }
    if (data.brith_day == "") {
        win.alert("提示", "出生日期不能为空");
        return;
    }
    if (data.nation == "") {
        win.alert("提示", "民族不能为空");
        return;
    }
    if (data.person_type == "") {
        win.alert("提示", "人员类型不能为空");
        return;
    }
    var datas = {};
    datas.data = data;
    datas.id = ID;
    datas.user = readData("USER_KEY").name;
    datas.token = readData("USER_KEY").token;
    datas = JSON.stringify(datas);
    $.ajax({
        url: "/update_people",
        type: "post",
        dataType: "json",
        async: false,
        headers: {'Content-Type': 'application/json'},
        data: datas,
        timeOut: 10000,
        success: function (data) {
            console.log(data);
            if (data.code == 0) {
                win.alert('提示', data.msg, function (r) {
                    history.go(0);
                });
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

var $tab = $(".personList");
var $li = $(".design .nav li");
$li.click(function () {
    $this = $(this);
    var index = $li.index($this);
    $tab.eq(index).removeClass("dis").siblings().addClass("dis")
})

function changes() {
    var settings = {
        "url": "/getfirstUnit",
        "method": "POST",
        "data": {
            user: readData("USER_KEY").name,
            token: readData("USER_KEY").token,
            pid: $("#unit_first option:selected").val(),
        },
    };
    $.ajax(settings).done(function (data) {
        if (data.code == 0) {
            var html = "<option value=''></option>";
            for (var i = 0; i < data.row.length; i++) {
                html += "<option value='" + data.row[i].id + "'>" + data.row[i].name + "</option>"
            }
            $("#unit_second").html(html);
        } else {
            win.alert("提示", data.msg)
        }

    })
}

//选项卡切换
var $li = $(".design ul li");
var $content = $(".footer_content");
$li.click(function () {
    $this = $(this);
    var index = $li.index($this);
    $content.eq(index).removeClass("score_hide").siblings().addClass('score_hide')
});


/*-----图表展示逻辑-----*/
//图表中切换btn
var $btns = $(".person_ana .btn");
var $charts = $(".person_ana .chart");
$btns.click(function () {
    $this = $(this);
    var index = $btns.index($this);
    $this.addClass("default").siblings().removeClass("default");
    $charts.eq(index).addClass("chart_show").siblings().removeClass("chart_show");
});


//echarts图表的切换，折线图、饼状图、柱状图。
var text = '性别';
console.log(obj);
if (obj.role_id == 1) {
    echart("sex");
} else if (obj.role_id == 2) {
    echart("sex", obj.id)
} else if (obj.role_id == 3) {
    echart("sex", undefined, obj.id)
}

var $fie = $("#field");
var dataMo;
$fie.change(function () {
    $op = $("#field option:selected");
    dataMo = $op.val();
    text = $op.text(); //逻辑应该是如果选中了一级单位，那么我这个就从一级单位中查询
    echart(dataMo)
    // switch(cli){
    //     case 0:
    //         echart(dataMo);
    //         break;
    //     case 1:
    //         echart(dataMo,parseFloat(first));
    //         break;
    //     case 2:
    //         echart(dataMo,undefined,parseFloat(second));
    //         break;
    // }
})

//获取图表字段
function echart(condi, firstId, secondId) {
    if (condi == undefined) {
        if (dataMo) {
            condi = dataMo;
        } else {
            condi = "sex"
        }
    }
    var user = obj.name;
    var token = obj.token;
    var datas = {
        user: user,
        token: token,
        condition: condi,
        unit_first: firstId,
        unit_second: secondId
    };
    console.log(datas);
    $.ajax({
        url: "/diplay_chart",
        type: "post",
        data: datas,
        success: function (data) {
            // console.log(data);
            // data = JSON.parse(data);
            console.log(data)
            if (data.code == 0) {
                var result = data.row;
                var counts = data.data;
                var res = [];
                var count = [];
                var pie = [];
                for (var j = 0; j < counts.length; j++) {
                    var pieObj = {};
                    count.push(counts[j].counts);
                    res.push(counts[j][condi]);
                    pieObj.value = counts[j].counts;
                    pieObj.name = counts[j][condi];
                    pie.push(pieObj)
                }
                bulidEchart(res, count, text);
                bulidPieEchart(pie);
                bulidBarEchart(res, count)
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest);
            console.log(textStatus);
            console.log(errorThrown);
        }
    })
}


//折线图
function bulidEchart(data, counts, name) {
    option = {};
    var myChart = echarts.init(document.getElementById('someChart'));

// // 指定图表的配置项和数据

    var option = {  //折线图
        title: {
            text: name
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        // legend: {
        //     data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
        // },
        // toolbox: {
        //     feature: {
        //         saveAsImage: {}
        //     }
        // },
        grid: {
            left: '5%',
            right: '8%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                // name:name,
                type: 'category',
                boundaryGap: true,
                data: data
            }
        ],
        yAxis: [
            {
                name: "数量",
                type: 'value',
            },
        ],
        series: [
            {
                name: "数量",
                type: 'line',
                data: counts
            },
            // {
            //     name:'联盟广告',
            //     type:'line',
            //     stack: '总量',
            //     areaStyle: {normal: {}},
            //     data:[220, 182, 191, 234, 290, 330, 310]
            // },
            // {
            //     name:'视频广告',
            //     type:'line',
            //     stack: '总量',
            //     areaStyle: {normal: {}},
            //     data:[150, 232, 201, 154, 190, 330, 410]
            // },
            // {
            //     name:'直接访问',
            //     type:'line',
            //     stack: '总量',
            //     areaStyle: {normal: {}},
            //     data:[320, 332, 301, 334, 390, 330, 320]
            // },
            // {
            //     name:'搜索引擎',
            //     type:'line',
            //     stack: '总量',
            //     label: {
            //         normal: {
            //             show: true,
            //             position: 'top'
            //         }
            //     },
            //     areaStyle: {normal: {}},
            //     data:[820, 932, 901, 934, 1290, 1330, 1320]
            // }
        ]
    };


// 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}


//饼状图
function bulidPieEchart(data) {
    var myChart = echarts.init(document.getElementById('pieChart'));

// // 指定图表的配置项和数据

//饼状图逻辑
    var option = {
        title: {
            // text: '某站点用户访问来源',
            // subtext: '纯属虚构',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            // data: ["性别"]
        },
        series: [
            {
                name: name,
                type: 'pie',
                radius: '80%',
                center: ['50%', '50%'],
                // data:[
                //     // {value:335, name:'直接访问'},
                //     // {value:310, name:'邮件营销'},
                //     // {value:234, name:'联盟广告'},
                //     // {value:135, name:'视频广告'},
                //     // {value:1548, name:'搜索引擎'}
                //     {value:330,name:"男"},
                //     {value:330,name:"女"}
                // ],
                data: data,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };


// 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}


//柱状图
function bulidBarEchart(data, counts) {
    var myChart = echarts.init(document.getElementById('barChart'));

// // 指定图表的配置项和数据

    var option = {
        color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: data,
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '数量',
                type: 'bar',
                barWidth: '30%',
                data: counts
            }
        ]
    };


// 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

