import http, { IncomingMessage, ServerResponse } from 'http';

const requestListener = function (req: IncomingMessage, res: ServerResponse) {
  res.writeHead(200);
  res.end('Hello, World 2!');
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT);