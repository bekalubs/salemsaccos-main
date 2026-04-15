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

export const isAuthenticated = () => {
  return !!getAuthToken();
};

export const getUserRole = () => {
  const user = getUserData();
  return user?.role || null;
};

export const getCurrentUserId = () => {
  const user = getUserData();
  return user?.username || '965400d7-0e27-4419-940a-0ad529d738e5'; // Default mock for backward compatibility if needed
};
