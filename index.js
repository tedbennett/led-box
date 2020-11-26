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
console.log(`websocket server created at ${server.address().address}, port: ${port}, hostname: ${require('os').hostname}`)

// list of boxes, pair of websocket and box name
var boxes = [];
// list of client websockets
var clients = [];


wss.on("connection", function(ws) {
  console.log("websocket connection open")

  ws.on('message', function incoming(data) {
    let json = JSON.parse(data)
    
    if (type = json.type) {
      switch(type) {
        // Sent on user connecting
        /* Message format:
        {
          type: 'client connect',
        }
        */
        case "client connect": {
          console.log("Client added");
          clients.push(ws);
          break;
        }
        // Box has come online, send to all clients
        /* Message format:
        {
          type: 'box connect',
          name: {Box name}
        }
        */
        case "box connect": {
          console.log("Box added");
          boxes.push({socket: ws, name: json.name})
          clients.forEach((socket) => {
            const message = {
              type: 'box connect',
              name: json.name
            }
            socket.send(JSON.stringify(message))
    
          })
          break;
        }
        // Pattern received from user, send to selected led box
        /* Message format:
        {
          type: 'pattern',
          pattern: {Array of 64 colour codes},
          name: {Name of recipient box}
        }
        */
        case "pattern": {
          console.log(json.pattern)
          box = boxes.find((box) => box.name === json.name)
          const message = {
            type: 'pattern',
            pattern: json.pattern
          }
          box.socket.send(message)
          break;
        }
      }  
    }
  });

  ws.on("close", function() {
    // Cache length to quickly see if ws is box or client
    const numBoxes = boxes.length;
    // Get box as need its name, then remove from list
    const box = boxes.find((box) => box.socket === ws);
    boxes = boxes.filter((box) => box.socket !== ws);

    if (boxes.length !== numBoxes) {
      clients.forEach((socket) => {
        const message = {
          type: 'box disconnect',
          name: box.name
        }
        socket.send(JSON.stringify(message))
      })
    } else {
      clients = clients.filter((client) => client !== ws);
    }
    console.log(`websocket connection closed, now ${boxes.length} connections`);
  })
})
