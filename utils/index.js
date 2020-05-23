/**
 * utils工具
 * by: Peanut
 */


/**
 * 获取当前日期
 * @param {*} date 
 */
function getDay(date) {
    var date2 = new Date();
    var date1 = new Date(date);
    var iDays = parseInt(Math.abs(date2.getTime() - date1.getTime()) / 1000 / 60 / 60 / 24);
    return iDays;
}
/**
 * 获取当前具体时间
 * @param {*} date 
 */
function formatDate(date) {
    var tempDate = new Date(date);
    var year = tempDate.getFullYear();
    var month = tempDate.getMonth() + 1;
    var day = tempDate.getDate();
    var hour = tempDate.getHours();
    var min = tempDate.getMinutes();
    var second = tempDate.getSeconds();
    var week = tempDate.getDay();
    var str = ''
    if (week === 0) {
        str = '星期日'
    } else if (week === 1) {
        str = "星期一";
    } else if (week === 2) {
        str = "星期二";
    } else if (week === 3) {
        str = "星期三";
    } else if (week === 4) {
        str = "星期四";
    } else if (week === 5) {
        str = "星期五";
    } else if (week === 6) {
        str = "星期六";
    }
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (min < 10) {
        min = "0" + min;
    }
    if (second < 10) {
        second = "0" + second;
    }
    return year + "-" + month + "-" + day + "日 " + hour + ":" + min + ' ' + str;
}
/**
 * rgb转base64
 * @param {*} color 
 */
function colorRGBtoHex(color) {
    var rgb = color.split(',');
    var r = parseInt(rgb[0].split('(')[1]);
    var g = parseInt(rgb[1]);
    var b = parseInt(rgb[2].split(')')[0]);
    var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    return hex;
}
/**
 * base64转rgb
 * @param {*} color 
 */
function colorHex(color) {
    // 16进制颜色值的正则
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 把颜色值变成小写
    if (reg.test(color)) {
        // 如果只有三位的值，需变成六位，如：#fff => #ffffff
        if (color.length === 4) {
            var colorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
            }
            color = colorNew;
        }
        // 处理六位的颜色值，转为RGB
        var colorChange = [];
        for (var i = 1; i < 7; i += 2) {
            colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
        }
        return "rgb(" + colorChange.join(",") + ")";
    } else {
        return color;
    }
};

module.exports = {
    getDay, formatDate, colorRGBtoHex, colorHex
}
