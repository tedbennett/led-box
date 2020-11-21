var WebSocketServer = require("ws").Server
const path = require('path');
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000

app.use(express.static(path.join(__dirname, 'client/build')));

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")

wss.on("connection", function(ws) {
  console.log("websocket connection open")

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    ws.send(message)
  });


  ws.on("close", function() {
    console.log("websocket connection close")
  })
})
