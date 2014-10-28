var http = require("http");
var url = require("url");
var fs = require("fs");
var main = require("./main"),
    makeJSON = require("./makeJSON");


http.createServer(function(request, response) {
    var data = fs.readFileSync("./index.html", "utf-8");
    var pathname = url.parse(request.url).pathname;
    console.log("Request for " + pathname + " received.");
    console.log("request.url : " + request.url);
    var modules = main.run(['c:\\node\\annotation']);
    var json = makeJSON.make(modules);
    //console.log(json);
    response.writeHead(200, {
        "Content-Type": "text/html"
    });
    response.write(JSON.stringify(json));
    response.end();
}).listen(4344);
