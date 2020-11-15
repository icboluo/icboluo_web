/*
    定义出一个根据id获取到指定标签对象的函数
 */
function jQuery(id) {
    var obj = document.getElementById(id);
    return obj;
}

$ = jQuery;