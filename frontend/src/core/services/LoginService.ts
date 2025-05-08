import { createEmailLogin, logoutUser } from '../api/accountApi';
import { setAuthTokens, clearAuthTokens, checkIfLoggedIn } from '../utils/auth';
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

  const user = await createEmailLogin({ emailId, password });

  // Store tokens
  const { accessToken, refreshToken, expiresInSeconds } = user.authUser.auth;
  if (!accessToken || !refreshToken) {
    throw new Error('Login failed: missing tokens');
  }

  setAuthTokens({ accessToken, refreshToken, expiresInSeconds });

  // Fetch & store config values
  const [partners, newNames, soldNames] = await Promise.all([
    getChannelPartnersApi(),
    getNewProjectNamesApi(),
    getSoldProjectNamesApi()
  ]);

  setChannelPartners(partners);
  setNewProjectNames(newNames.map(p => p.projectName || ''));
  setSoldProjectNames(soldNames.map(p => p.projectName || ''));

  return user.authUser.user;
};

export const logout = async () => {
  await logoutUser();
  clearAuthTokens();

  clearChannelPartners();
  clearNewProjectNames();
  clearSoldProjectNames();
};

export const checkIfLoggedInUser = () => {
  return checkIfLoggedIn();
};
