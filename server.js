const http = require("http");
const fs = require("fs");

const port = 8888;
const address = "localhost";

const server = http.createServer((req, res) => {
  let rurl = req.url;

  console.log("Request: " + rurl);
  
  //If the request is for <filename>, read file and return data
  //temporarily using explicit filenames
  if (rurl === "/index.html" || rurl == "/") {
    fs.readFile("./public/index.html", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      return res.end();
    });
  } else if (rurl == "/main.css") {
    fs.readFile("./public/main.css", (err, data) => {
      res.writeHead(200, { "Content-Type": "text/css" });
      res.write(data);
      return res.end();
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    return res.end("Error 404: Page not found");
  }
});

server.listen(port, address, () => {
  console.log(`Server running at ${address}:${port}`);
});