const express = require("express");

const app = express();
const port = 8080;

app.get("/", (req, res) => {
  return res.status(200).json({ server: "ok" });
});

app.listen(port, () => console.log(`http://localhost:${port}`));
