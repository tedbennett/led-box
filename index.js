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

// list of box ids
var boxes = [];
var clients = [];

var wss = new WebSocketServer({server: server})
console.log(`websocket server created at ${server.address().address}, port: ${port}, hostname: ${require('os').hostname}`)
wss.on("connection", function(ws) {
  console.log("websocket connection open")

  ws.on('message', function incoming(data) {
    let json = JSON.parse(data)
    if (type = json.type) {
      switch(type) {
        // Sent on user connecting
        case "client connection": {
          console.log("Client added");
          clients.push(ws);
          break;
        }
        // Sent on box coming online
        case "box connection": {
          console.log("Box added");
          boxes.push(ws)
          break;
        }
        // Pattern received from user
        case "pattern": {
          console.log(json.text)
          boxes.forEach( (socket) => socket.send(json.text))
          break;
        }
      }  
    }
  });

  ws.on("close", function() {
    // remove from lists
    boxes = boxes.filter((box) => box !== ws)
    clients = clients.filter((client) => client !== ws)
    console.log("websocket connection close")
    console.log(boxes.length)
  })
})
