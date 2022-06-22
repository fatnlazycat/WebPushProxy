import http, { IncomingMessage, ServerResponse } from 'http';
import webpush from 'web-push';

const PUBLIC_KEY = 'BBbMAl7Exs3fPN4KmNGNLa8F5svFPgSXWpZog3J1o_5xoq-sQqUqpu_WV9KjXrjQdksiSkMCC2L-_lFUp4l_PWw';
const PRIVATE_KEY = 'SLB7j4GiGey6Bhfy-69Rgjw3e2mBuj8f8QTyykv1PWo';

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

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');

      if (req.url === '/' && req.method === 'POST'
      ) {
        webpush.setVapidDetails(
          'mailto:example@yourdomain.org',
          PUBLIC_KEY,
          PRIVATE_KEY,
        );

        // const pushSubscription = {
        //   endpoint: '.....',
        //   keys: {
        //     auth: '.....',
        //     p256dh: '.....'
        //   }
        // };
        // const pushSubscription = JSON.parse(payload);
        const pushSubscription = payload;
        webpush.sendNotification(pushSubscription, 'Your Push Payload Text').then(
          (result) => {
            console.log('send result:', result);
          }, (err) => {
            console.log('could not send push:', err);
          }
        );
        res.writeHead(200).end('data received');
        return;
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