import axios from 'axios';
import * as jwt from 'jsonwebtoken';

const getJWT = () => {
  const payload = {
    // issued at time, 60 seconds in the past to allow for clock drift
    iat: Math.floor(Date.now() / 1000 - 60),
    // JWT expiration time (10 minute maximum)
    exp: Math.floor(Date.now() / 1000 + (10 * 60)),
    // GitHub App's identifier
    iss: "174878"
  }
  const jwtToken = jwt.sign(payload, process.env.GH_ARGO_PROXY_PRIVATE_KEY, { algorithm: 'RS256'});
  console.log('jwt token', jwtToken);
  return jwtToken;
};

const getInstallationId = async () => {
  const installations = await axios.get(
    `https://api.github.com/app/installations`,
    {  
      headers: {
        'Authorization': `Bearer ${getJWT()}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    }  
  );
  console.log('installations', installations);
  const installationId = Array.isArray(installations) ? installations[0].id : 23543825;
  console.log('installation', installationId)
  return installationId;
}

export const getToken = async () => {
  const installationId = await getInstallationId();
  console.log('installationId', installationId);
  const installationToken = await axios.post(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {  
      headers: {
        'Authorization': `Bearer ${getJWT()}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    }  
  );
  console.log('installationToken', installationToken);
  return installationToken;
};