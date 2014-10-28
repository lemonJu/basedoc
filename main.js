var fs = require("fs"),
    modules = {};

String.prototype.endWith = function(str) {
    if (str == null || str == "" || this.length == 0 || str.length > this.length)
        return false;
    if (this.substring(this.length - str.length) == str)
        return true;
    else
        return false;
    return true;
}

var $M = {
    $method: function(name, params, returns, description, example) {
        this.$name = name;
        this.$params = params;
        this.$returns = returns;
        this.$description = description;
        this.$example = example;
    },

    $module: function(name, description, methods) {
        this.$name = name;
        this.$description = description;
        this.$methods = methods;
    },
};

var $P = {
    $param: function(type, description) {
        this.$type = type;
        this.$description = description;
    },
    $return: function(type, description) {
        this.$type = type;
        this.$description = description;
    }
};

function run(obj, isAnalyze) {
    if (typeof obj === "object") {
        //modules
        var dirs = obj["scanLocation"],
            deep = obj["deep"] || false,
            i, nums = 0;

        if(!dirs) {
            console.log("No useful scanLocation,You should check your setting file!\n");
            return "";
        }
        walk(dirs, 0, deep, function(path, floor) {
            if (path.endWith(".js")) {
                var data = fs.readFileSync(path, "utf-8");
                modules[path] = analyze(data);
            }
        });

        //生成HTML
        return modules;
        
    }
}

function analyze(text) {

    text = text.replace(/[\r\n]/g, "");
    var i, k, j;
    var comments = text.match(/\/\*\*.*?\*\//gm);
    var commentType;
    //保存同一个模块的所有注解信息
    var message = [];

    if (comments)

        for (i = 0; i < comments.length; i++) {

        comments[i] = comments[i].replace(/@/gm, "$");
        comments[i] = comments[i].replace("/*", "");
        comments[i] = comments[i].replace("*/", "");
        var inner = comments[i].split("*");
        var type, p = [],
            r = [],
            temp = {};

        for (k = 0; k < inner.length; k++) {
            var inCom = inner[k].split(" ");
            if (inCom[0] && inCom[0].indexOf("$param") != -1) {
                //如果是参数加入队列
                var reType = inCom[0].replace("$param", "");
                p.push(new $P["$param"](reType, inCom[1]));
            } else if ($M[inCom[0]]) {
                //如果是模块新建
                type = new $M[inCom[0]](inCom[1]);
                //标记类型
                type[inCom[0]] = true;
            } else if (inCom[0] && inCom[0].indexOf("$return") != -1) {
                //如果是返回值加入队列
                var reTurn = inCom[0].replace("$return", "");
                r.push(new $P["$return"](reTurn, inCom[1]));
            } else {
                //其他情况
                temp[inCom[0]] = inCom[1];
            }
        }
        //组合
        type["$params"] = p;
        type["$returns"] = r;

        for (j in temp) {
            type[j] = temp[j];
        }

        message.push(type);
    }
    return message;
}

function generateHTML(message) {

}

function walk(path, floor, isDeep, handleFile) {
    handleFile(path, floor);
    floor++;
    var dirs = fs.readdirSync(path);
    dirs.forEach(function(item, index) {
        var tmpPath = path + '\\' + item;
        var dict = fs.statSync(tmpPath);
        if (dict.isDirectory()) {
            isDeep && walk(tmpPath, floor, isDeep, handleFile);
        } else {
            handleFile(tmpPath, floor);
        }

    });
}

function walk1(path, floor, isDeep, handleFile) {
    handleFile(path, floor);
    floor++;
    fs.readdir(path, function(err, files) {
        if (err) {
            console.log('read dir error');
        } else {
            files.forEach(function(item) {

                var tmpPath = path + '\\' + item;
                fs.stat(tmpPath, function(err1, stats) {
                    console.log(stats);
                    if (err1) {
                        console.log('stat error');
                    } else {
                        if (stats.isDirectory()) {
                            isDeep && walk(tmpPath, floor, isDeep, handleFile);
                        } else {
                            handleFile(tmpPath, floor);
                        }
                    }
                })
            });
            console.log("scan finish");
        }
    });
}
exports.run = run;
