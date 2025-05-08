export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');
export const getTokenExpiry = () => {
  const expiry = localStorage.getItem('expires_at');
  return expiry ? parseInt(expiry, 10) : null;
};

export const setAuthTokens = ({
  accessToken,
  refreshToken,
  expiresInSeconds
}: {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
}) => {
  const now = Date.now();
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
  localStorage.setItem('expires_at', (now + expiresInSeconds * 1000).toString());
};

export const clearAuthTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('expires_at');
};

export const isTokenExpiringSoon = () => {
  const expiry = getTokenExpiry();
  if (!expiry) return false;
  const timeLeft = expiry - Date.now();
  return timeLeft < 10 * 60 * 1000; // less than 10 minutes left
};
