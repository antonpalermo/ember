const express = require("express");

const app = express();
const port = process.env.PORT || 8081;

app.disable("x-powered-by");
app.get("/", (req, res) => {
  return res.status(200).json({ status: "ok" });
});

app.listen(port, () =>
  console.log(`server up and running on http://localhost:${port}`)
);
