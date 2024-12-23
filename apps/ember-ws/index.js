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
        case "offer:request":
          console.log("offer recieved");

          wss.clients.forEach(client => {
            if (client.readyState === client.OPEN) {
              client.send(
                JSON.stringify({
                  event: "offer:response",
                  offer: message.offer
                }),
                err => {
                  if (err) {
                    console.log(
                      "🥲 an error is encountered during sending response"
                    );
                  }

                  console.log("response send to the client");
                }
              );
            }
          });

          break;
        case "answer:request":
          wss.clients.forEach(client => {
            if (client.readyState === client.OPEN) {
              client.send(
                JSON.stringify({
                  event: "answer:response",
                  offer: message.offer
                }),
                err => {
                  if (err) {
                    console.log(
                      "🥲 an error is encountered during sending response"
                    );
                  }

                  console.log("response send to the client");
                }
              );
            }
          });
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
