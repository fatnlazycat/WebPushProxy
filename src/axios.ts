import axios from "axios";

export const axiosClientGH = axios.create({
  baseURL: 'https://api.github.com/repos/fatnlazycat/githubToArgoProxy/',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
  },
});

export const axiosClientBE = axios.create({
  baseURL: 'https://httpbin.org/',
})