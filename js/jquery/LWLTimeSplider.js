/**
* Created with IntelliJ IDEA.
* User: markeluo
* Date: 12-4-26
* Time: 下午5:01
* To change this template use File | Settings | File Templates.
*/
/**
* 类 名 称： DragDropTime
* 功能说明： 时间轴拖动类
* 版权信息： CopyRight 2012 markeluo
* 创 建 人： markeluo | email:563944808@QQ.com  
* 创建日期： 2012-5-4
*/

//以下定义移动方向的常量
Pg0DD_FREEMOVE = 0; //自由移动，没有限制
Pg0DD_HMOVE = 1; //水平移动，也就是左右移动
Pg0DD_VMOVE = 2; //垂直移动，也就是上下移动

function LWLTimeSliderObj(obj) {
    var me = this;
    this.moveStyle = Pg0DD_FREEMOVE;
    this.foo = (typeof obj == "string") ? document.getElementById(obj) : obj;
    this.onDrop = function () { };
    this.onDrag = function () { };
    this.isMoved = function (newPosX, newPosY) { return { x: true, y: true} }; //offsetX:x的移动距离;offsetY:y的移动距离
    this.foo.addEventListener("touchstart", Pg0touchStart, false);
    this.foo.addEventListener("touchmove", Pg0touchMove, false);
    this.foo.addEventListener("touchend", Pg0touchEnd, false);

    this.foo.onmousedown = function (e) {
        var foo = me.foo;
        e = e || event;
        if (e.layerX > 0) {
            foo.oOffset = { x: e.layerX, y: e.layerY };
        } else {
            foo.oOffset = { x: e.offsetX, y: e.offsetY };
        }
        document.onmousemove = me.drag; //移动
        document.onmouseup = me.drop; //移动结束
        document.onselectstart = function () { return false; };
    }

    this.drag = function (e) {
        var foo = me.foo;
        e = e || event;
        var mv = me.isMoved(e.clientX - foo.oOffset.x + document.body.scrollLeft,
            e.clientY - foo.oOffset.y + document.body.scrollTop);
        if (mv.x && me.moveStyle != Pg0DD_VMOVE) {
            foo.style.left = e.clientX - foo.oOffset.x + document.body.scrollLeft + "px";
        }
        if (mv.y && me.moveStyle != Pg0DD_HMOVE) {
            foo.style.top = e.clientY - foo.oOffset.y + document.body.scrollTop + "px";
        }
        me.onDrag();
    }

    this.drop = function (e) {
        e = e || event;
        document.onmousemove = document.onmouseup = document.onselectstart = null;
        me.onDrop();
    }

    var startX, endX;
    /*添加触控事件*/
    function Pg0touchStart(e) {
        var foo = me.foo;
        e = e || event;
        if (e.layerX > 0) {
            foo.oOffset = { x: e.targetTouches[0].pageX, y: e.targetTouches[0].pageY };
        } else {
            foo.oOffset = { x: e.targetTouches[0].pageX, y: e.targetTouches[0].pageY };
        }
        startX = e.targetTouches[0].pageX;
    }
    function Pg0touchEnd(e) {
        touchInfo = {}
        e = e || event;
        document.onmousemove = document.onmouseup = document.onselectstart = null;
        me.onDrop();
    }
    function Pg0touchMove(e) {
        var foo = me.foo;
        e = e || event;
        var mv = me.isMoved(e.targetTouches[0].pageX, e.targetTouches[0].pageY);
        if (mv.x && me.moveStyle != Pg0DD_VMOVE) {
            foo.style.left = e.targetTouches[0].pageX + "px";
        }
        if (mv.y && me.moveStyle != Pg0DD_HMOVE) {
            foo.style.top = e.targetTouches[0].pageY + "px";
        }
        me.Pg0touchMove();
    }
}