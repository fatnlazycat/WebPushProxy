import axios from 'axios';
import * as jwt from 'jsonwebtoken';

export const APP_ID = 174878;
const getJWT = (): string => {
  const payload = {
    // issued at time, 60 seconds in the past to allow for clock drift
    iat: Math.floor(Date.now() / 1000 - 60),
    // JWT expiration time (10 minute maximum)
    exp: Math.floor(Date.now() / 1000 + (10 * 60)),
    // GitHub App's identifier
    iss: APP_ID,
  }
  const jwtToken = jwt.sign(payload, process.env.GH_ARGO_PROXY_PRIVATE_KEY, { algorithm: 'RS256'});
  console.log('jwt token', jwtToken);
  return jwtToken;
};

const getInstallationId = async (): Promise<string | undefined> => {
  const installations = (await axios.get(
    `https://api.github.com/app/installations`,
    {  
      headers: {
        'Authorization': `Bearer ${getJWT()}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    }  
  )).data;
  const installationId = Array.isArray(installations) ? installations[0].id as string : undefined;
  return installationId;
}

export const getToken = async (): Promise<string> => {
  const installationId = await getInstallationId();
  console.log('installationId', installationId);
  const installationToken = await axios.post(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {},
    {  
      headers: {
        'Authorization': `Bearer ${getJWT()}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    }  
  );
  console.log('installationToken', installationToken.data);
  return installationToken.data.token;
};