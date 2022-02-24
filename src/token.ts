import * as jwt from 'jsonwebtoken';

export const getToken = () => {
  const payload = {
    // issued at time, 60 seconds in the past to allow for clock drift
    iat: Date.now() - 60 * 1000,
    // JWT expiration time (10 minute maximum)
    exp: Date.now() + (10 * 60) * 1000,
    // GitHub App's identifier
    iss: "174878"
  }
  const token = jwt.sign(payload, process.env.GH_ARGO_PROXY_PRIVATE_KEY, { algorithm: 'RS256'});
  console.log('token', token);
  return token;
}