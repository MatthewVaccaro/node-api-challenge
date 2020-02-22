const express = require("express");
const router = require("./router/router");

const server = express();
server.use(express.json());
const port = 4000;
server.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

//Sub Routes
server.use("/api/", router);

//Sanitiy Checked (Confirmed)
server.get("/", (req, res) => {
  res.json({ message: "Hello world!" });
});
