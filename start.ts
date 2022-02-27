import axios from 'axios';
import http, { IncomingMessage, ServerResponse } from 'http';
import { APP_ID, getToken } from './src/token';

const requestListener = function (req: IncomingMessage, res: ServerResponse) {
  try {
    console.log('received request', req.url, req.headers);
    
    let dataMain = '';
    req.on('data', chunk => {
      dataMain += chunk;
    })
    req.on('end', async () => {
      const payload = dataMain && JSON.parse(dataMain);
      console.log('payload', payload);

      if (req.url === '/' && req.method === 'POST' && req.headers['x-github-event'] === 'check_suite') {
        const a = payload.check_suite ? payload.check_suite.head_sha : payload.check_run.head_sha;
        const installationId = payload.installation.id;
        const key = await getToken(/*installationId*/);
        
        const axiosR = await axios.post('https://api.github.com/repos/fatnlazycat/githubToArgoProxy/check-runs',
          {
            name: 'Eat the sausages',
            head_sha: a,
          }, {  
            headers: {
              'Authorization': `Bearer ${key}`,
              'Accept': 'application/vnd.github.v3+json',
            },
          });
        console.log('response from github for POST/check_runs', axiosR.status, axiosR.data);
        res.writeHead(200).end('Hello, World from switch statement!');
        return;
      }; 

      if (payload?.action === 'created' && payload.check_run?.app?.id === APP_ID) {
        console.log('========= now we can start the pipeline ===========');
        console.log('check_run', payload.check_run);

        const installationId = payload.installation.id;
        const key = await getToken(/*installationId*/);
        const axiosR = await axios.patch(`https://api.github.com/repos/fatnlazycat/githubToArgoProxy/check-runs/${payload.check_run.id}`,
          {
            status: 'in_progress',
          }, {  
            headers: {
              'Authorization': `Bearer ${key}`,
              'Accept': 'application/vnd.github.v3+json',
            },
          });
        console.log('response from github for PATCH/check_runs/in_progress', axiosR.status, axiosR.data);
        res.writeHead(200).end('Hello, World from switch statement!');
        return;
      };

      if (req.url.match(/\/success\/.+/g)) {
        const checkRunId = req.url.substring(8);
        const key = await getToken(/*installationId*/);
        const axiosR = await axios.patch(`https://api.github.com/repos/fatnlazycat/githubToArgoProxy/check-runs/${checkRunId}`,
          {
            status: 'completed',
            conclusion: 'success',
          }, {  
            headers: {
              'Authorization': `Bearer ${key}`,
              'Accept': 'application/vnd.github.v3+json',
            },
          });
        console.log('response from github for PATCH/check_runs/success', axiosR.status, axiosR.data);
      }

      res.writeHead(200).end('Hello, World 9!');
    });
  } catch(e) {
    console.log('in catch', e);
  }
  
}

const server = http.createServer(requestListener);
server.listen(process.env.PORT);