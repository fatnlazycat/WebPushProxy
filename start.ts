import axios from 'axios';
import http, { IncomingMessage, ServerResponse } from 'http';
import { getToken } from './src/token';

const requestListener = function (req: IncomingMessage, res: ServerResponse) {
  console.log('request', req.url, req.headers);
  
  let dataMain = '';
  req.on('data', chunk => {
    dataMain += chunk;
  })
  req.on('end', async () => {
    console.log('payload', dataMain);

    switch (req.url) {
      case '/': 
        if (req.method === 'POST' && req.headers['x-github-event'] === 'check_suite') {
          console.log('got it!');
          const b = dataMain ? JSON.parse(dataMain) : 'no payload';
          const a = b.check_suite ? b.check_suite.head_sha : b.check_run.head_sha;
          const key = getToken();
          
          const axiosR = await axios.post('https://api.github.com/repos/fatnlazycat/githubToArgoProxy/check-runs',
            {
              name: 'Buy the milk',
              head_sha: a,
            }, {  
              headers: {
                'Authorization': `Bearer ${key}`,
                'Accept': 'application/vnd.github.v3+json',
              },
            });
          console.log('response from github', axiosR.status, axiosR.data);
          res.writeHead(200).end('Hello, World from switch statement!');
          return;
        }; 
    }
    res.writeHead(200).end('Hello, World 6!');
  });

  
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT);