import axios from 'axios';
import config from '../config';
import { getToken, logout } from '../utils/auth';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach token automatically
api.interceptors.request.use((req) => {
  const token = getToken();
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Optional: handle errors globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      toast.error("Session expired");
      logout();
      window.location.href = '/login';
    } else if (err.response?.data?.detail) {
      toast.error(err.response.data.detail);
    } else {
      toast.error("Something went wrong");
    }
    return Promise.reject(err);
  }
);

export default api;
