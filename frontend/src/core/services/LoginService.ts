import { createEmailLogin, logout as logoutApi } from '../api/accountApi';
import { setAuthTokens, clearAuthTokens } from '../utils/auth';
import {
  setChannelPartners,
  setNewProjectNames,
  setSoldProjectNames,
  clearChannelPartners,
  clearNewProjectNames,
  clearSoldProjectNames
} from '../utils/config';
import {
  getChannelPartnersApi,
  getNewProjectNamesApi,
  getSoldProjectNamesApi
} from '../api/configApi';

export const login = async (emailId: string, password: string) => {
  const response: any = await createEmailLogin({ emailId, password });
  const user = response?.authUser?.user;
  const auth = response?.authUser?.auth;

  if (!auth?.accessToken || !auth?.refreshToken) {
    throw new Error('Login failed: missing tokens');
  }

  setAuthTokens({ accessToken: auth.accessToken, refreshToken: auth.refreshToken, expiresInSeconds: auth.expiresInSeconds });

  // Store user email in localStorage
  if (user?.emailId) {
    localStorage.setItem('user_email', user.emailId);
  }

  // Add a short delay to ensure token is available
  await new Promise(res => setTimeout(res, 100));

  // Fetch & store config values
  const [partners, newNames, soldNames] = await Promise.all([
    getChannelPartnersApi(),
    getNewProjectNamesApi(),
    getSoldProjectNamesApi()
  ]);

  setChannelPartners(partners);
  setNewProjectNames(newNames.map(p => p.projectName || ''));
  setSoldProjectNames(soldNames.map(p => p.projectName || ''));

  return { user, auth };
};

export const logout = async () => {
  await logoutApi();
  clearAuthTokens();

  // Clear user email from localStorage
  localStorage.removeItem('user_email');

  clearChannelPartners();
  clearNewProjectNames();
  clearSoldProjectNames();
};
