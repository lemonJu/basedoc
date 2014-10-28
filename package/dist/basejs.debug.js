/**
@module basejs
*/
var basejs = function(undefined) {
    var sourceCodes = {},
        global = {},
        relevance = {};
    var loading = 0,
        loaded = 0,
        relayScripts,
        ajaxCallBack;
    var $$ = function() {
        var createOpp = function() {
                var e;
                if (window.ActiveXObject) e = new ActiveXObject("Microsoft.XMLHTTP");
                else e = new XMLHttpRequest;
                return e
            },
            ajax = function(setting) {
                var method = setting.method || "post",
                    callback = setting.success || function() {},
                    params = setting.params || "",
                    dataType = setting.dataType || "",
                    beforeSend = setting.beforeSend || undefined,
                    asnyc = setting.asnyc || true,
                    error = setting.error || function() {},
                    url = setting.url || function() {},
                    xhr = createOpp();
                xhr.onreadystatechange = function() {
                    var backXHR = {};
                    backXHR.responseURL = url;
                    if (xhr.readyState == 4 && xhr.status == 200) {
                        if (dataType == "json") callback.call(backXHR, eval("(" + xhr.responseText + ")"));
                        else callback.call(backXHR, xhr.responseText)
                    } else if (xhr.readyState == 1 && beforeSend) {
                        beforeSend.call(backXHR, xhr)
                    }
                };
                xhr.open(method.toUpperCase(), setting.url, asnyc);
                if (method == "post") xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhr.send(params)
            },
            post = function(e, r, n) {
                ajax({
                    url: e,
                    params: r,
                    success: n
                })
            };
        return {
            post: post
        }
    }();
    var isString = function(e) {
            return typeof e === "string"
        },
        isWindow = function(e) {
            return e.toString() === "[object Window]"
        },
        isPlainObject = function(e) {
            if (e.nodeType || typeof e != "object" || isWindow(e)) {
                return false
            }
            return true
        },
        isFunction = function(e) {
            return typeof e == "function"
        },
        isIE = !!(window.attachEvent && !window.opera),
        relTo = function(e) {
            if (!/\.js$/.test(e)) e = e + ".js";
            if (/\/\//.test(e)) return e;
            var r = window.location,
                n = r.port == "" ? "" : ":" + r.port,
                t = r.origin || r.protocol + "//" + r.host + n,
                a = r.href.replace(t, "").split("/");
            a[0] = t;
            lstPage = e.match(/\.\.\//g);
            e = e.replace("../", "");
            e = e.replace("./", "");
            if (lstPage) {
                if (lstPage.length < a.length - 1) {
                    a.length = a.length - lstPage.length - 1;
                    return a.join("/") + "/" + e
                } else {
                    throw new Error("Addr Is InValid")
                }
            }
            a.length = a.length - 1;
            return a.join("/") + "/" + e
        },
        load = function(e, r) {
            if(r)ajaxCallBack = r;
            
            var n = [];
            var sign = true;
            if (isString(e)) {
                n = [e]
            } else {
                n = e
            }
            for (var t in n) {
                
                var a = relTo(n[t]);
                if (!sourceCodes[a]) {
                    sign = false;
                    loading++;
                    $$.post(a, "", function(e) {
                        loaded++;
                        //去除注释
                        var reg = /("([^\\\"]*(\\.)?)*")|('([^\\\']*(\\.)?)*')|(\/{2,}.*?(\r|\n))|(\/\*(\n|.)*?\*\/)/g,
                            n = this.responseURL;

                        // 去注释的文本  
                        e = e.replace(reg, function(word) {
                            return /^\/{2,}/.test(word) || /^\/\*/.test(word) ? "" : word;
                        });


                        e = e.replace("define(", 'define("' + n + '",');
                        //保存编译后的源码
                        sourceCodes[n] = e;
                        var t = e.match(/require\(\".*?\"/g);
                        relevance[n] = [];
                        if (t && t.length) {
                            relevance[this.responseURL] = t;
                            for (var a = 0; a < t.length; a++) {
                                t[a] = t[a].replace(/require\(/, "");
                                t[a] = t[a].replace(/\"/g, "");
                                load(t[a])
                            }
                        } else {
                            if (loading == loaded) {
                                loading = loaded = 0;
                                ajaxCallBack();
                                return
                            }
                        }
                    })
                }
            }
            if(sign) ajaxCallBack();
        },
        relayAjax = function(e, r) {
            var callback = r;

            if (!e || !e.length || e.length < 1) {
                if (!callback) return;
                callback();
                return
            }

            var n = [];
            if (isString(e)) {
                n = [e]
            } else {
                n = e
            }
            //如果已经加载就不管
            for (var t in n) {
                var a = relTo(n[t]);
                if (!sourceCodes[a]) {
                    loading++;
                    $$.post(a, "", function(e) {
                        loaded++;
                        sourceCodes[a] = e;
                        if (loading == loaded) {
                            loading = loaded = 0;
                            if (!callback) return;
                            callback();
                        }
                    })

                }
            }
        },
        relayLoad = function(src) {
            var code = relTo(src);
            try {
                if (isIE) execScript(sourceCodes[code]);
                else window.eval(sourceCodes[code]);
            } catch (e) {
                throw new Error("Code In " + code + " Is Error! \nError Message : " + e.message)
            };
        },
        loadRelay = function(src) {
            var code = relTo(src);
            if (relevance[code]) {
                if (relevance[code] && relevance[code].length == 0) {
                    try {
                        eval(sourceCodes[code]);
                    } catch (e) {
                        throw new Error("Code In " + code + " Is Error! \nError Message : " + e.message);
                    }

                    relevance[code] = null;
                    return
                }
                if (relevance[code] && relevance[code].length > 0) {
                    for (var i in relevance[code]) {
                        loadRelay(relevance[code][i])
                    }
                    try {
                        eval(sourceCodes[code]);
                    } catch (e) {
                        throw new Error("Code In " + code + " Is Error! \nError Message : " + e.message);
                    }
                    relevance[code] = null
                }
            }
        },
        require = function(e) {
            var r = relTo(e);
            return global[r] ? global[r] : ""
        },
        resolve = require.resolve = relTo,

        async = require.async = function(e, callback) {
            var relay = relayScripts || [];

            var modules = e;
            if (isString(modules)) {
                modules = [modules]
            }

            relayAjax(relay, function() {
                for (var t in relay) {
                    relayLoad(relay[t]);
                }
                relayScripts = undefined;
                //加载模块
                load(modules, function() {
                    var back = [];
                    for (var t in modules) {
                        loadRelay(modules[t]);
                        back.push(global[relTo(modules[t])])
                    }
                    callback.apply(null, back)
                });
            });

        },
        //使用ID来标记！
        define = window.define = function(e, r, useID) {
            var n = {
                exports: {},
                uri: e,
                id: e
            };
            if (arguments.length < 2) return;
            if (isString(r) || isPlainObject(r)) {
                n.exports = r
            } else if (isFunction(r)) {
                var t = r.call(this, require, n.exports, n);
                n.exports = !!t ? t : n.exports
            }
            //使用id来标注
            if (useID) {
                global[n.id] = n.exports
            } else {
                global[e] = n.exports
            }

        },
        /**
        @method async
        @static
        @param e {object} 加载的信息，包括依赖relay(array)，模块modules(array)以及回调函数callback
        @chainable
        @return {object} 返回自身
        */
        config = function(e) {
            var relay = e.relay || [],
                modules = e.modules || [],
                callback = e.callback || null;
            if (isString(relay)) relay = [relay];
            if (isString(modules)) modules = [modules];
            if (!callback) {
                //如果没有指定回调则不在此加载依赖
                relayScripts = relay;
                return;
            }
            //加载配置
            for (var i = 0;i<=modules.length;i++){
                if(basejs.map && basejs.map[modules[i]]) {modules[i] = basejs.map[modules[i]]}
            }
            
            //加载依赖
            relayAjax(relay, function() {
                for (var t in relay) {
                    relayLoad(relay[t]);
                }
                //加载模块
                load(modules, function() {
                    var back = [];
                    for (var t in modules) {
                        loadRelay(modules[t]);
                        back.push(global[relTo(modules[t])])
                    }
                    callback.apply(null, back)
                });
            });


            return this
        };


    define.cmd = {};
    var mianNode = document.getElementById("basejsnode") || (function() {
        return document.getElementsByTagName("script")[0];
    })();

    

    if (mianNode) {
        var enterAddr = mianNode.getAttribute("data-enter");
        enterAddr && load(enterAddr, function() {
            loadRelay(enterAddr)
        })
    }
    return {
        async: async,
        config: config
    }
}(basejs);
