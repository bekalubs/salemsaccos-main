// src/utils/jwt.ts

const TOKEN_KEY = 'salem_token';
const USER_KEY = 'salem_user';

export const setAuthData = (token: string, user: any) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getUserData = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const isTokenExpired = (token: string) => {
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  if (!token) return false;
  if (isTokenExpired(token)) {
    clearAuthData();
    return false;
  }
  return true;
};

export const getUserRole = () => {
  const user = getUserData();
  return user?.role || null;
};

export const getCurrentUserId = () => {
  const user = getUserData();
  return user?.username || null;
};
