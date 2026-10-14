export const getBackendUrl = () => {
  if (import.meta.env?.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  const custom = typeof window !== 'undefined' ? localStorage.getItem('naruto_server_ip') : null;
  if (custom) return custom.startsWith('http') ? custom : `http://${custom}:4000`;
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const host = window.location.hostname;
    if (host !== 'localhost' && host !== '127.0.0.1') {
      return window.location.origin;
    }
  }
  return 'http://localhost:4000';
};

export const BACKEND_URL = getBackendUrl();

