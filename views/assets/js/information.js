/**
 * Created by "zhangHeng" on 2018/2/1 0001.
 */



//切换信息资料选项卡

var $lis = $(".design .nav li");
var $div = $(".footer_content .personList");
var $but = $(".design .but");
$lis.click(function(){
    $this = $(this);
    var index = $lis.index($this);
    $div.eq(index).addClass("perRecord").siblings().removeClass("perRecord");
    $but.eq(index).removeClass("normal").siblings().addClass("normal")
});