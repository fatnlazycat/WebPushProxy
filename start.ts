import http, { IncomingMessage, ServerResponse } from 'http';

const requestListener = function (req: IncomingMessage, res: ServerResponse) {
  console.log('request', req.url, req.headers);
  
  let dataMain = '';
  req.on('data', chunk => {
    dataMain += chunk;
  })
  req.on('end', () => {
    console.log('payload', dataMain);
  });

  switch (req.url) {
    case '/': 
      if (req.method === 'POST' && req.headers['x-github-event'] === 'check_suite') {
        console.log('got it!');
        const b = JSON.parse(dataMain);
        const a = b.check_suite ? b.check_suite.head_sha : b.check_run.head_sha
        const data = JSON.stringify({
          name: 'Buy the milk',
          head_sha: a,
        })
        
        const options = {
          hostname: 'api.github.com',
          path: '/repos/fatnlazycat/githubToArgoProxy/check-runs',
          method: 'POST',
          headers: {
            'Accept': 'application/vnd.github.v3+json',
          }
        }
        
        const r = http.request(options, resp => {
          console.log(`statusCode: ${res.statusCode}`)
        
          res.on('data', d => {
            process.stdout.write(d)
          })
        })
        
        req.on('error', error => {
          console.error(error)
        })
        
        r.write(data)
        r.end()
        return;
      }; 
  }
  res.writeHead(200).end('Hello, World 3!');
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT);