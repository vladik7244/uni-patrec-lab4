const http = require("http");
const lib = require("../lib/algorithm");
let App = null;

const jsonMiddleWare = (next) => (req, res) => {
  res.json = (obj) => res.end(JSON.stringify(obj));
  res.error = (code, message) => res.end(JSON.stringify({code, message}));
  next(req, res);
};

const bodyMiddleWare = (next) => (request, response) => {
  const body = [];
  request
    .on('data', function (chunk) {
      body.push(chunk);
    })
    .on('end', function () {
      request.body = Buffer.concat(body).toString();
      try {
        request.data = JSON.parse(request.body);
      } catch(e) {
        request.data = {};
      }
      next(request, response);
    });  
};

const handlers = {
  "/": (req, res) => {
    res.json({
      hello: "world"
    });
  },
  "/clasterize": (req, res) => {
    const {
      items,
      limit = 1,
      marks = [],
    } = req.data;

    console.log(`Clasterize ${items.length}, with ${items[0].length} characteristics`);

    if (!(items instanceof Array)) {
      res.error(401, "Bad request. Specify items field as Array");
      return;
    }
    
    const {statistic} = lib.Algorithm.clasterize(App.parseItems(items, marks), limit);
    res.json(statistic.resultObj());

  }
};


const reqHandler = (req, res) => {
  const handler = handlers[req.url];
  if (!handler) {
    res.error(404, "Not found");
  } else {
    handler(req, res);
  }
};


const server = http.createServer(bodyMiddleWare(jsonMiddleWare(reqHandler)));


const runServer = (port = 8000) => {
  return new Promise((resolve, reject) => {
    try {
      server.listen(port)
    } catch (e) {
      reject(e.message);
      return false;
    }
    resolve(port);
  });
};

module.exports = {
  start: (configs, _App) => {
    App = _App;
    return runServer(configs.port)
  }
};