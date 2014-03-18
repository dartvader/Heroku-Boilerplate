// Create a HTTP server on port 8000
// Send plain text headers and 'Hello World' to each client

var http = require("http");
var express = require("express");
var port = process.env.PORT || 8000;
var urlParse = require('url');
var app = express();
var counter = 0;
// Rest function to split the requests
/* 
restFunc = function(method, tableName, recId, bodyStr) {
	var insertObj, outObj;
	outObj = {
		success : true
	}

	if { !tableName || tableName !== 'calender'} {
		outObj.success = false;
		outObj.message = "REST error: table name invalid or missing";
	} else if (method === 'POST' || method === 'PUT') {
		insertObj = JSON.parse(bodyStr);
	}
	if (!outObj.success) {
		return outObj;
	}

	switch (method) {
		case 'GET':
	}
};
*/
http.createServer(function (req, res) {
  	
	var path = req.url;
	console.log("requested=" + path + " counter=" + counter);

	req.on('data', function(chunk) {
		bodyStr += chunk.toString();
	});

	res.writeHead(200, {'Content-Type': 'text/html'}); // prepare response headers

	url = urlParse.parse(req.url, true);
	urlpathname = url.pathname;
	argArray = urlpathname.split('/');

	tableName = argArray[1];
	recId = argArray[2];

	outputstr = "Hello world <br> \n" + req.method;
	outputstr += "table name<br> \n" + tableName;
	outputstr += "record id <br> \n" + recId;
	res.end(outputstr); 
	/* 
	if (path == "/") {
		res.end("Calender API .....<br><a href='/page2'>Page 2</a><br><a href='/page3'>Page 3</a>\n");
	} else if (path == "/page2") {
		res.end("This is page 2. <a href='/'>Back.</a>\n"); // send response and close connection	
	} else if (path == "/page2") {
		res.end("This is page 3. <a href='/'>Back.</a>\n"); // send response and close connection	
	}
	*/


}).listen(port);

// console info message
console.log('Server running at http://127.0.0.1:' + port);
