/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var url = require('url');
var fs = require('fs');
var path = require('path');
// var $ = require('jQuery');
results = [{username: 'player1', text: 'hello', roomname: 'lobby', createdAt: new Date()}];

var requestHandler = function(request, response) {
  console.log(url.parse(request.url).pathname);
  console.log(process.cwd());
  var defaultCorsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type, accept',
    'Access-Control-Max-Age': 10 // Seconds.
  };
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.

  // The outgoing status.
  var statusCode = 200;
  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/
  var messages = {results: results};
    //[{username: 'player 1', text: 'hello', roomname: 'lobby', createdAt: new Date()}, {username: 'player2', text: 'hello back', roomname: 'lobby', createdAt: new Date()}, {username: 'player3', text:'goodbye', roomname: 'lobby2', createdAt: new Date()}]};

  if (request.method === 'GET' && request.url === '/') {
    headers['Content-Type'] = 'text/html';
    response.writeHead(statusCode, headers);
    fs.readdir('../client/', function(err, data) {
      console.log(response._header);
      var file = Buffer(data).toString();
      response.write(file);
    //   data.on('data', function(chunk) {
    //     body.push(chunk);
    //   }).on('end', function() {
    //     body = Buffer.concat(body).toString();
    //     console.log(body);
    //   });

    });

  }
  // headers['Content-Type'] = 'application/json';
  if (request.method === 'OPTIONS') {
    statusCode = 200;
    response.writeHead(statusCode, headers);
  }

  else if (request.method === 'GET' && request.url === '/classes/messages') {
  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.

  } else if (request.method === 'POST' && request.url === '/classes/messages') {
    statusCode = 201;
    // console.log('request:', request);
    // results.push(request._postData);
    // messages = {results: results};
    var body = [];
    request.on('data', function(chunk) {
      body.push(chunk);
    }).on('end', function() {
      body = JSON.parse(Buffer.concat(body).toString());
      body.createdAt = new Date();
      body.objectId = body.createdAt;
      results.push(body);
      messages = {results: results};
           // at this point, `body` has the entire request body stored in it as a string
    }); 

  } else if (request.method === 'POST' && request.url === '/classes/room') {
    statusCode = 201;

    var body = [];
    results.push(request._postData);
    messages = {results: results};
    // request.on('data', function(chunk) {
    //   body.push(chunk);
    // }).on('end', function() {
    //   body = JSON.parse(Buffer.concat(body).toString());
    //   results.push(body);
    //   messages = {results: results};
    //        // at this point, `body` has the entire request body stored in it as a string
    // }); 

  }else if (request.url === '/arglebargle') { 
    statusCode = 404;
  }// .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  response.writeHead(statusCode, headers);
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.end(JSON.stringify(messages));
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

exports.requestHandler = requestHandler;
