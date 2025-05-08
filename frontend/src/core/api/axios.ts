import axios from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  isTokenExpiringSoon,
  setAuthTokens
} from '../utils/auth';

import { createAuth } from './accountApi'; // this calls the refresh token endpoint

const instance = axios.create({
  baseURL: "https://7saykmdyg2.ap-south-1.awsapprunner.com",
  headers: {
    'Content-Type': 'application/json'
  }
});

// 🧠 Add auth only if `config.auth = true`
instance.interceptors.request.use(async (config) => {
  console.log('AUTH FLAG:', (config as any).auth, 'TOKEN:', getAccessToken());
  (config.headers as any)['X-Debug-Source'] = 'axios-interceptor';
  if ((config as any).auth) {
    if (isTokenExpiringSoon()) {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        const res = await createAuth({ refreshToken });
        setAuthTokens({ 
            accessToken: res.accessToken, 
            refreshToken: res.refreshToken, 
            expiresInSeconds: res.expiresInSeconds 
        }); // expects { accessToken, refreshToken, expiresInSeconds }
      }
    }

    const token = getAccessToken();
    if (token) {
      // If headers is not a plain object, convert to one
      if (!config.headers || typeof config.headers !== 'object') {
        config.headers = {} as any;
      }
      (config.headers as any)['Authorization'] = `Bearer ${token}`;
    }
  }

  return config;
});

export default instance;
