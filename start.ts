import http, { IncomingMessage, ServerResponse } from 'http';
import { APP_ID } from './src/token';
import { createCheckRun, startCheckRun, completeCheckRun } from './src/controller';
import { COMPLETED_URL, COMPLETED_URL_LENGTH } from './src/constants';

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  try {
    console.log('received request', req.url);
    
    let dataMain = '';
    req.on('data', chunk => {
      dataMain += chunk;
    });
    
    req.on('end', async () => {
      const payload = dataMain && JSON.parse(dataMain);
      console.log('payload', payload);

      if (req.url === '/' &&
        req.method === 'POST' &&
        req.headers['x-github-event'] === 'check_suite' &&
        payload?.action !== 'completed'
      ) {
        const checkRunCreationResponse = await createCheckRun(req, payload);
        res.writeHead(200).end(checkRunCreationResponse);
        return;
      } else if (payload?.action === 'created' && payload.check_run?.app?.id === APP_ID) {
        const checkRunStartResponse = await startCheckRun(payload);
        res.writeHead(200).end(checkRunStartResponse);
        return;
      } else if (req.url.match(COMPLETED_URL)) {
        const checkRunId = req.url.substring(COMPLETED_URL_LENGTH);
        const checkRunCompleteResponse = await completeCheckRun(checkRunId, payload);
        res.writeHead(200).end(checkRunCompleteResponse);
      } else {
        res.writeHead(200).end('no match found - 404');
      };
    });
  } catch(e) {
    console.log('caught exception:', e);
  };
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT);