/**
 * Created by "zhangHeng" on 2018/1/30 0030.
 */
var pageNow = 1;
var pageSum;
var pagesize = 10;
// console.log(obj.name, obj.id);
getSroreList(parseFloat(obj.id));
//后去全部的人
function getSroreList(id, secId) {
    if (id == undefined) {
        return;
    }
    if (secId == undefined) {
        secId = undefined;
    }

    var settings = {
        "url": "/getRecord",
        "method": "POST",
        "data": {
            user: readData('USER_KEY').name,
            token: readData('USER_KEY').token,
            unit_first: id,
            unit_second: secId,
            page: pageNow,
            pageSize: pagesize,
        }
    }
    $.ajax(settings).done(function (response) {
        console.log(response);
        if (response.code == 0) {
            var data = response.data;
            var html = '';
            for (var i = 0; i < data.length; i++) {
                if (pageNow == 1) {
                    var k = i + 1;
                } else {
                    var k = parseInt((pageNow - 1) * pagesize + i + 1);
                }
                html += "<tr>"
                html += "<td style='font-size:14px;width: 4%;'>" + k + "</td><td style='font-size:14px;width: 5%'>" + data[i].unit_first + "</td>" +
                    "<td style='font-size:14px;width: 5%;'>" + data[i].unit_second + "</td><td style='font-size:14px;width: 15%;'>" + data[i].project + "</td>" +
                    "<td style='font-size:14px;width: 10%;'>" + data[i].subject + "</td><td style='font-size:14px;width: 7%;'>" + data[i].card_id + "</td>" +
                    "<td style='font-size:14px;width: 7%;'>" + data[i].name + "</td><td style='font-size:14px;width: 7%;'>" + data[i].achievement + "</td>" +
                    "<td style='font-size:14px;width: 7%;'>" + data[i].evaluation + "</td><td style='font-size:14px;width: 15%;'>" + getMyDate(data[i].check_time) + "</td>" +
                    "<td style='font-size:14px;width: 10%;'>" + data[i].remark + "</td>" +
                    "<td style='font-size:14px;'><span class='label label-info' style='cursor: pointer;margin-right: 10px' onclick='bianji(" + data[i].id + ")''><i class='glyphicon glyphicon-edit'>&nbsp;</i>编辑</span>" +
                    "<span class='label label-danger' style='cursor: pointer;' onclick='shanchu(" + data[i].id + ")''><i class='glyphicon glyphicon-remove'>&nbsp;</i>删除</span></td>"
                html += "</tr>"
            }
            if (pagesize != data.length) {
                for (var j = 0; j < pagesize - data.length; j++) {
                    html += "<tr style='height:37px;'></tr>";
                }
            }
            $('#scoreList').html(html);
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

//初始化为第一页 获取日志列表
getSroreList();
//第一页
function first() {
    if (pageNow == 1) {
        win.alert("提示", "已是第一页");
        return;
    }
    pageNow = 1;
    getSroreList();
}
//上一页
function prevpage() {
    if (pageNow == 1) {
        win.alert("提示", "已是第一页");
        return
    }
    pageNow--;
    getSroreList();
}
//下一页
function nextpage() {
    if (pageNow == pageSum) {
        win.alert("提示", "已是最后一页");
        return;
    }
    pageNow++;
    getSroreList();
}
//最后一页
function last() {
    if (pageNow == pageSum) {
        win.alert("提示", "已是最后一页");
        return;
    }
    pageNow = pageSum;
    getSroreList();
}
//按页数查询
function selectByPage() {
    if ($('#ty').val() == '') {
        pageNow = 1;
        getSroreList();
        return;
    } else if ($('#ty').val() < 1 || $('#ty').val() > pageSum) {
        win.alert('提示', '输入页数为正数且不能大于' + pageSum);
        $('#ty').val('');
        return;
    } else {
        pageNow = $('#ty').val();
        getSroreList();
        return;
    }

}
//转换时间
function getMyDate(timeStamp) {
    var newDate = new Date();
    newDate.setTime(timeStamp);
    Date.prototype.pattern = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        var week = {
            "0": "/u65e5",
            "1": "/u4e00",
            "2": "/u4e8c",
            "3": "/u4e09",
            "4": "/u56db",
            "5": "/u4e94",
            "6": "/u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

    return newDate.pattern("yyyy-MM-dd hh:mm:ss");
};
//选中默认每页条数查询
function selectPageSize() {
    for (var i = 0; i < $('#pagesize option').length; i++) {
        if ($('#pagesize option').eq(i).is(':selected') == true) {
            pagesize = $('#pagesize option').eq(i).val();
            selectByPage();
        }
    }
}

function add() {
    $('.box').css('display', 'block');
}


//新增窗口关闭
function close1() {
    $("#box").hide()
}

//选项卡切换
var $li = $(".design ul li");
var $content = $(".footer_content");
$li.click(function () {
    $this = $(this);
    var index = $li.index($this);
    $content.eq(index).removeClass("score_hide").siblings().addClass('score_hide')
});

var data = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
var myChart = echarts.init(document.getElementById('someChart'));

// 指定图表的配置项和数据
var option = {
    title: {
        text: '成绩图表'
    },
    tooltip : {
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
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '5%',
        right: '8%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : true,
            data : data
        }
    ],
    yAxis : [
        {
            name : '分数',
            type : 'value',
        },
    ],
    series : [
        {
            name:'成绩',
            type:'line',
            stack: '总和',
            data:[200,214,130,143,200,240,310,101,246,210,320,401]
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

