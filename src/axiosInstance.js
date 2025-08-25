import axios from "axios";

export const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // keep cookies if you use them
});

// Attach Bearer on every request (normal login)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto‑logout on 401/403 unless caller opts out via X-Skip-Auth-Redirect
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const skip = error?.config?.headers?.["X-Skip-Auth-Redirect"];
    if ((status === 401 || status === 403) && !skip) {
      try {
        localStorage.removeItem("jwt");
        localStorage.setItem("logout_at", String(Date.now()));
      } catch {}
      if (window.location.pathname !== "/") {
        window.location.replace("/");
      }
    }
    return Promise.reject(error);
  }
);

export default api;