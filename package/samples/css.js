define(function(require, exports, module) {

    module.id = "css";

    var isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };
    var each = function(obj, callback) {
        for (var i in obj) {
            callback(i, obj[i]);
        }
    };
    var pfx = function(style) {
        //得到符合的前缀
        var s = "Webkit,Moz,O,ms,Khtml",
            pre = s.split(","),
            tNode = document.createElement("div");
        for (var i = 0; i < pre.length; i++) {
            //重新组装style
            var reStyle = pre[i] + style.charAt(0).toUpperCase() + style.substr(1);

            if (tNode.style[reStyle] != undefined) {
                return reStyle;
            }
        }

        return style;
    };

    exports.setCss = function(node, styles) {
        if (isArray(node)) {
            each(node, function(k, v) {
                each(styles, function(style, value) {
                    v.style[pfx(style)] = value;
                });
            });
        } else if (typeof styles === 'object') {
            each(styles, function(style, value) {
                node.style[pfx(style)] = value;
            });
        }
    };
    exports.getCss = function(node, style) {
        //兼容ie ff
        var styles = window.getComputedStyle ? window.getComputedStyle(node, null) : node.currentStyle;
        return styles[pfx(style)] === "auto" ? 0 : styles[pfx(style)];
    };

});
