import http, { IncomingMessage, ServerResponse } from 'http';

const requestListener = function (req: IncomingMessage, res: ServerResponse) {
  console.log('request', req.url, req.headers);
  switch (req.url) {
    case '/': 
      if (req.method === 'POST' && req.headers['x-github-event'] === 'check_suite') {
        console.log('got it!');
      }; break;
  }
  res.writeHead(200);
  res.end('Hello, World 3!');
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT);