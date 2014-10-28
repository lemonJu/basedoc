/*
	根据json和路径生成HTML
*/
var fs = require("fs"),
    copy = require("./copyFile");

exports.make = function(json, address) {
    var innerPage = "./package";

    address = address || "./docs";

    var html = fs.readFileSync("./package/index.html", "utf-8");

    //replace
    html = html.replace(/{'modules'}/gm, JSON.stringify(json));

    

    //复制，替换
	copy.exists(innerPage, address);
    
    fs.writeFileSync(address + "\\index.html", html);
    setTimeout(function(){
        fs.writeFileSync(address + "\\index.html", html);
    },1000);
    
}
