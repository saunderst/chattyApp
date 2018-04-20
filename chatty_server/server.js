/* server.js
 * This is the chat server, capable of managing multiple remote clients.
 */

const express = require('express');
const WebSocket = require('ws');
const uuidv1 = require('uuid/v1');
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new WebSocket.Server({ server });

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
let clientCount = 0;    // counts active connections; for display on the front end
let clientID = 0;       // counts each new connection; appended to messages so clients can uniquely identify message source

// a little function to update any current status for the clients, presently just consisting of the number of active connections
updateStatus = (server, clients) => {
  server.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({type: 'incomingStatus', clients: clients}));
    }
  });
}

wss.on('connection', (ws) => {
  ws.clientID = ++clientID;
  updateStatus (wss, ++clientCount);
  // as a client message is received, broadcast it to all clients with a unique ID attached
  ws.on('message', (message) => {  
    let msgFields = JSON.parse(message);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        let type = msgFields.type;
        switch (type) {
          case 'postNotification':
            type = 'incomingNotification';
            break;
          case 'postMessage':
            type = 'incomingMessage';
            break;
        }
        client.send(JSON.stringify({userID: ws.clientID, username: msgFields.username, content: msgFields.content, id: uuidv1(), type: type}));
      }
    });
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected');
    updateStatus (wss, --clientCount);
  });
});