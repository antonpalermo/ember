const WebSocket = require("ws");
const port = 8080;

const wss = new WebSocket.Server({ port }, () => {
  console.log("👂 for connection on", `ws://localhost:${port}`);
});

wss.on("connection", ws => {
  console.log("✅ client connected");

  ws.on("message", msg => {
    if (Buffer.isBuffer(msg)) {
      const message = JSON.parse(msg.toString());

      switch (message.event) {
        case "send":
          console.log("sending triggered");
          break;
        case "drop":
          console.log("droping triggered");
          break;
      }
    }
  });

  ws.on("close", () => {
    console.log("❌ client disconnected");
  });
});
