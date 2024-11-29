const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files (CSS, images) from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Store submitted form data
const dataList = [];

// Handle WebSocket connections
wss.on("connection", (ws) => {
  console.log("New WebSocket connection");

  // Send the existing data to the newly connected client
  ws.send(JSON.stringify(dataList));

  // Handle messages from clients
  ws.on("message", (message) => {
    console.log("Received:", message.toString());

    // Add new data to the list and broadcast it to all clients
    const newData = JSON.parse(message.toString());
    dataList.push(newData);

    // Broadcast updated data to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(dataList));
      }
    });
  });
});

// Start the server
const PORT = 4401;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
