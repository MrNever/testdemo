/**
 * Created by Mr_hu on 2015/6/15.
 */
$(document.body).ready(function(){
    initcontrol()
})

function initcontrol(){
    var stardiv=$("#divcontent").find("div")[1];
    $(stardiv).addClass("checked");
    $("#divcontent").find("div").bind("click", function () {
        $("#divcontent>div").removeClass("checked");
        $(this).addClass("checked");
        var selvalue = $(this).html();
        outvaluedata=selvalue;
    });
    var startli=$("#scroller").find("li")[0];
    $(startli).addClass("liback")
    $("#scroller").find("li").bind("click",function(){
        if($(this).attr("class")==""){
            $(this).addClass("liback");
        }else if($(this).attr("class")==undefined){
            $(this).addClass("liback");
        }else if($(this).attr("class")!=""){
            $(this).removeClass("liback");
        }

    })
    chartshow();
    InitalizationTimSlider();
}

function chartshow(){
    $('#container').highcharts({
        chart:{
            backgroundColor: '#2e323d'
        },
        title: {
            text: ''
        },
        credits:{
            enabled:false // 禁用版权信息
        },
        yAxis: {
            title: {
                text: ''
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        series: [{
            name: '可用设计产能负荷率',
            data: [-3124, -2700, -2710]
        }, {
            color:'#e4ea0a',
            name: '开工率',
            data: [1100, 1700, 700]
        }, {
            type:'column',
            color:'#55bf39',
            name: '现金流',
            data: [0,0,2000]
        }]
    })
    $("#container").find('text').css("fill","#ffffff");
}




//时间轴模块
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(),    //day
        "h+": this.getHours(),   //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
        (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length == 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

var StartTime = "2014/01/01 00:00:00";
var EndTime = new Date().format("yyyy-MM-dd hh:mm:ss");
var FilterStartTime = TimeConvert(StartTime);
var FilterEndTime = TimeConvert(EndTime);

function TimSizeChange(_timesizestart, _timesizeEnd) {
    FilterStartTime = _timesizestart;
    FilterEndTime = _timesizeEnd;

    PointDataGetTimeChangeData(FilterStartTime, FilterEndTime);
    FilterEquipmentAPIData(_timesizestart, _timesizeEnd);
}
function TimeConvert(_oldtimestr) {
    if (_oldtimestr.indexOf("-") > 0) {
        _oldtimestr = _oldtimestr.replace("-", "/").replace("-", "/");
    }
    return Date.parse(_oldtimestr);
}

function DateChanging(_starttime, _endtime) {
    $("#SpanstartTime").html(_starttime.format("yyyy-MM-dd hh:mm:ss"));
    $("#SpanEndTime").html(_endtime.format("yyyy-MM-dd hh:mm:ss"));
}

function InitalizationTimSlider() {
    //判断是否支持触控
    $.extend($.support, { touch: "ontouchend" in document });
    if ($.support.touch) {
        //支持触控

        //停用页面滚动功能
        document.body.addEventListener('touchmove', function (event) {
            event.preventDefault();
        }, false);
        //添加多点触控事件
        AddMultiTouchEventToMainbar();
    }

    createTimeSplider();
};

var mainbarwidth, yuluoffset, mainlef, maintop;
//时间轴开始时间
var SliderStartTime = new Date("2014/01/01 00:00:00");
//时间轴结束时间
var SliderEndTime = new Date();
//两个时间差,毫秒级
var Difference = SliderEndTime.getTime() - SliderStartTime.getTime();
//步长
var StepValue;
function createTimeSplider() {
    $("#mainBar").width($("#TimePanel").width() -10);
    mainbarwidth = $("#mainBar").width();
    //步长
    StepValue = Difference / mainbarwidth; //每个点位代表的毫秒数

    yuluoffset = $("#mainBar").offset();
    mainlef = yuluoffset.left;
    maintop = yuluoffset.top;
    $("#mainBar").css("width", mainbarwidth);

    $("#PointPanel").css("width", mainbarwidth - $("#EndPoint").width() - $("#StartPoint").width());
    $("#PointPanel").css("left", $("#EndPoint").width() + mainlef);

    EndPointlefwidth = $("#mainBar").width() - $("#EndPoint").width() + mainlef;
    $("#EndPoint").css("left", EndPointlefwidth);
}
//------------------------多点触控事件处理开始----------------------------//
var TouchArray, TouchLeftPoint, TouchRightPoint;
var TouchObj = document.getElementById("mainBar");
//添加多点触控事件
function AddMultiTouchEventToMainbar() {
    //添加触控事件,开始
    TouchObj.addEventListener("touchstart", function (e) {
        if (changedTouches != null && changedTouches.length == 2) {
            TouchArray = e.touches;
        }
    }, false);
    //添加触控事件，移动
    TouchObj.addEventListener("touchmove", function (e) {
        changedTouches = e.changedTouches;
        if (changedTouches != null && changedTouches.length == 2) {
            //1.先区分左右触点，用X坐标比较
            if (changedTouches[0].pageX < changedTouches[1].pageX) {
                TouchLeftPoint = changedTouches[0];
                TouchRightPoint = changedTouches[1];
            } else {
                TouchLeftPoint = changedTouches[1];
                TouchRightPoint = changedTouches[0];
            }

            //2.定位左侧按钮位置
            if (TouchLeftPoint.pageX >= mainlef && TouchLeftPoint.pageX <= ($("#EndPoint").offset().left - $("#StartPoint").width())) {
                ChangePanelBar(TouchLeftPoint.pageX, true);
                ShowThisTime(TouchLeftPoint.pageX, true, StepValue); //显示当前正在移动的时间
                $("#StartPoint").css("left", TouchLeftPoint.pageX);
            }

            //3.定位右侧的按钮位置
            if (TouchRightPoint.pageX >= ($("#StartPoint").offset().left + $("#StartPoint").width()) && TouchLeftPoint.pageX <= ($("#mainBar").width() - $("#EndPoint").width() + mainlef)) {
                ChangePanelBar(TouchRightPoint.pageX, false);
                ShowThisTime((TouchRightPoint.pageX + $("#EndPoint").width()), false, StepValue); //显示当前正在移动的时间
                $("#EndPoint").css("left", TouchRightPoint.pageX);
            }
        }
    }, false);
}
//------------------------多点触控事件处理结束---------------------------//

window.onload = function () {
    $("#mainBar").width($("#TimePanel").width() - 10);
    mainbarwidth = $("#mainBar").width();
    //步长
    StepValue = Difference / mainbarwidth; //每个点位代表的毫秒数

    //3.容器
    var PointPanelbtn = new LWLTimeSliderObj("PointPanel");
    PointPanelbtn.moveStyle = Pg0DD_HMOVE;
    PointPanelbtn.isMoved = function (newPosX, newPosY) {
        PointPanelMoveChange(newPosX); //移动容器
        return { x: newPosX >= mainlef + $("#StartPoint").width() && newPosX <= ($("#mainBar").width() - $("#EndPoint").width() - $("#PointPanel").width() + mainlef) };
    }
    PointPanelbtn.onDrop = function () {
        StatisticsTimes(); //更新最新选中的时间段
    }


    //1.开始点
    var Startbtn = new LWLTimeSliderObj("StartPoint");
    Startbtn.moveStyle = Pg0DD_HMOVE;
    Startbtn.isMoved = function (newPosX, newPosY) {
        ChangePanelBar(newPosX, true);
        ShowThisTime(newPosX - $("#mainBar").offset().left, true, StepValue); //显示当前正在移动的时间
        return { x: newPosX >= mainlef && newPosX <= ($("#EndPoint").offset().left - $("#StartPoint").width()) }; //返回状态
    }
    Startbtn.onDrop = function () {
        StatisticsTimes(); //更新最新选中的时间段
    }

    //2.截止点
    var Endbtn = new LWLTimeSliderObj("EndPoint");
    Endbtn.moveStyle = Pg0DD_HMOVE;
    Endbtn.isMoved = function (newPosX, newPosY) {
        ChangePanelBar(newPosX, false);
        ShowThisTime((newPosX - $("#mainBar").offset().left + $("#EndPoint").width()), false, StepValue); //显示当前正在移动的时间
        return { x: newPosX >= ($("#StartPoint").offset().left + $("#StartPoint").width()) && newPosX <= $("#mainBar").width() - $("#EndPoint").width() + mainlef };
    }
    Endbtn.onDrop = function () {
        StatisticsTimes(); //更新最新选中的时间段
    }
};

//区域块滑动
function PointPanelMoveChange(_newPosX) {
    thisx = _newPosX - $("#StartPoint").width();
    thisy = thisx + $("#PointPanel").width() + $("#EndPoint").width();
    if (thisx >= mainlef && thisy <= $("#mainBar").width() + mainlef - $("#StartPoint").width()) {
        $("#StartPoint").css("left", thisx);
        $("#EndPoint").css("left", thisy);
    }
    ShowThisTime($("#StartPoint").offset().left - mainlef, true, StepValue);
    ShowThisTime(($("#EndPoint").offset().left - mainlef + $("#EndPoint").width()), false, StepValue)
}

//更改区域块大小
function ChangePanelBar(_newPosX, _bolisStart) {
    leftx = $("#StartPoint").offset().left + $("#StartPoint").width() - mainlef;
    rightx = $("#EndPoint").offset().left - mainlef;
    $("#PointPanel").css("width", rightx - leftx);
    if (_bolisStart) {
        if ($("#StartPoint").offset().left < 0) {
            alert("AAA");
        }
        leftvalue = $("#StartPoint").offset().left + $("#StartPoint").width();
        if (_newPosX > 0) {
            if (_newPosX < ($("#mainBar").offset().left + $("#mainBar").width() - $("#StartPoint").width() - $("#EndPoint").width())) {
                $("#PointPanel").css("left", leftvalue);
            }
        }
    } else {
        leftvalue = $("#StartPoint").offset().left + $("#StartPoint").width();
        if (_newPosX < ($("#mainBar").offset().left + $("#mainBar").width() - $("#StartPoint").width() - $("#EndPoint").width())) {
            $("#PointPanel").css("left", leftvalue);
        }
    }
}
//更新最新选中的时间段
function StatisticsTimes() {
    //*获得选中的开始时间点和结束时间点之间的位置
    var _StartIndex = $("#StartPoint").offset().left - mainlef;
    var _EndIndex = $("#EndPoint").offset().left + $("#EndPoint").width() - mainlef;

    //开始时间和截止时间
    var Times = GetSelTimes(_StartIndex, _EndIndex, StepValue);

    //时间选择区间更改
    TimSizeChange(Times[0], Times[1]);
}
var thistime1, thistime2;
function ShowThisTime(ThisTimeIndex, bolIsStartTime, _StepValue) {
    if (thistime1 == null) {
        thistime1 = new Date(SliderStartTime.format("yyyy/MM/dd hh:mm:ss"))
    }
    if (thistime2 == null) {
        thistime2 = new Date(SliderEndTime.format("yyyy/MM/dd hh:mm:ss"))
    }
    if (bolIsStartTime) {
        thistime1 = new Date(SliderStartTime.format("yyyy/MM/dd hh:mm:ss"));
        thistime1.setMilliseconds(thistime1.getMilliseconds() + parseInt(ThisTimeIndex * _StepValue))
    } else {
        thistime2 = new Date(SliderStartTime.format("yyyy/MM/dd hh:mm:ss"));
        thistime2.setMilliseconds(thistime2.getMilliseconds() + parseInt(ThisTimeIndex * _StepValue))
    }

    //时间更改中
    DateChanging(thistime1, thistime2);
}

//获得选择的时间段的值
function GetSelTimes(_StartInex, _EndIndex, _StepValue) {
    differenceNumber = _EndIndex - _StartInex; //选择的轴相差值

    var SelTimesArray = new Array(); //选中的开始时间和结束时间
    var StartTimeStr = SliderStartTime.format("yyyy/MM/dd hh:mm:ss");
    var ThisStartTime = new Date(StartTimeStr);
    var ThisEndtTime = new Date(StartTimeStr);

    ThisStartTime.setMilliseconds(ThisStartTime.getMilliseconds() + parseInt(_StartInex * _StepValue))
    ThisEndtTime.setMilliseconds(ThisEndtTime.getMilliseconds() + parseInt(_EndIndex * _StepValue));
    SelTimesArray.push(ThisStartTime);
    SelTimesArray.push(ThisEndtTime);

    return SelTimesArray;
}
