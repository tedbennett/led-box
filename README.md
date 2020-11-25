# LED Box


### Application Flow

Here's how this application works.

- A server is running on Heroku. This serves the client React app, as well as a WebSocket server that the client and boxes can connect to.
- A user opens the client app, and establishes a websocket connection.
- On connecting, the client tells the server that it is a client and gives it an ID.
- The server responds with a list of online boxes.
- A box is powered on, and a Flask WebSocket server on it starts up.
- The box sets up a WebSocket connection with the server, and tells it that it is a box.
- The server notifies the clients that a new box is online
- The client can select from online boxes and send a drawing



### Websocket Message Types (Endpoints)

Client/Box endpoints
- `connection type` - request from the server as to whether the socket is opened with a box or a client
- `box added` - notification from the server to the client when a box comes online
- `box removed` - notification from the server to the client when a box goes offline