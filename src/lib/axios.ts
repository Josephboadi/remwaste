import axios from 'axios';

const isDev = import.meta.env.DEV;
const proxyBase = import.meta.env.VITE_PROXY_BASE_URL;
const liveBase = import.meta.env.VITE_API_URL;

const baseURL = isDev
  ? `${proxyBase}` // → “/api”
  : liveBase; // → remote gateway

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
  // withCredentials: true
});

// ensure no Authorization header ever sneaks in
delete apiClient.defaults.headers.common['Authorization'];

export default apiClient;
