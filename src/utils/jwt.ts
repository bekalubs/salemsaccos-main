export const getCurrentUserId = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('username') || 'system';
  }
  return 'system';
};
