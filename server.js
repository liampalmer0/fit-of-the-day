const http = require("http");

const requestListener = function (req, res) {
  res.writeHead(200);
  res.end("Hello world");
  res.end();
};

const server = http.createServer(requestListener);
server.listen(8888);

console.log("Server started at localhost:8888");
