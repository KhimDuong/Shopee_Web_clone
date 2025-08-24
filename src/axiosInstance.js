import axios from "axios";

export const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto‑logout on 401/403
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      try {
        localStorage.removeItem("jwt");
        // notify other tabs
        localStorage.setItem("logout_at", String(Date.now()));
      } catch {}
      // drop history so Back won't return to protected page
      if (window.location.pathname !== "/") {
        window.location.replace("/");
      }
    }
    return Promise.reject(error);
  }
);

export default api;