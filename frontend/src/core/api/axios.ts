import axios from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  isTokenExpiringSoon,
  setAuthTokens
} from '../utils/auth';

import { createAuth } from './accountApi'; // this calls the refresh token endpoint

const instance = axios.create({
  baseURL: "https://mhyakc5h8c.ap-south-1.awsapprunner.com/",
  headers: {
    'Content-Type': 'application/json'
  }
});

// 🧠 Add auth only if `config.auth = true`
instance.interceptors.request.use(async (config) => {
  if ((config as any).withAuth) {
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
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    }
  }

  return config;
});

export default instance;
