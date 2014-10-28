var main = require("./main"),
	makeJSON = require("./makeJSON"),
	makeHTML = require("./makeHTML"),
	copy = require("./copyFile"),
    path = require("path"),
    fs = require("fs"),
    params = process.argv,
    modules;

var arg;
do arg = params.shift();
while (arg === "node" || __filename === fs.realpathSync('.') + "\\" + path.basename(arg))
arg && params.push(arg);

var setting = params[0] || "baseDoc.json";
var setObj = JSON.parse(fs.readFileSync(setting, "utf-8"));

//generate modules
modules = main.run(setObj);

if(modules && modules!="") {
	//generate json
	var json = makeJSON.make(modules);
	//generate HTML
	makeHTML.make(json, setObj["docLocation"]);
}else{
	console.log("Generate fail, No useful annotation, You should check you annotation file\n");
}

