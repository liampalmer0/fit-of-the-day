const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 8888;
const address = "localhost";
const validmime = {
  css: "text/css",
  html: "text/html",
  js: "text/javascript",
  json: "application/json",
  png: "image/png",
  jpeg: "image/jpeg",
};

const server = http.createServer((req, res) => {
  let rurl = req.url;

  console.log("Request: " + rurl);

  //If the request is for <filename>, read file and return data
  let rpath = buildPath(rurl);
  if (rpath !== 1) {
    fs.readFile(rpath[0], (err, data) => {
      res.writeHead(200, {
        "Content-Type": rpath[1],
      });
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
function buildPath(rurl) {
  //check if extension is valid
  let ext = path.extname(rurl);
  if (validmime[ext.slice(1)] != undefined) {
    console.log(`valid extension ${path.extname(rurl)}`);
    let rpath = ["public/" + rurl, validmime[ext.slice(1)]];
    //check if file exists
    if (fs.existsSync(rpath[0])) {
      return rpath;
    } else {
      console.log("file not found");
      return 1;
    }
  } else {
    console.log("invalid extension");
    return 1;
  }
}
