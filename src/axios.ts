import axios from "axios";

export const axiosClient = axios.create({
  baseURL: 'https://api.github.com/repos/fatnlazycat/githubToArgoProxy/',
  headers: {
    'Accept': 'application/vnd.github.v3+json',
  },
})