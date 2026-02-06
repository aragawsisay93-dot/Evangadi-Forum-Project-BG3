// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5500/api",
//   headers: { "Content-Type": "application/json" },
// });

// // ✅ Automatically attach token on every request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default api;

import axios from "axios";

// ============================
// Base URL
// ============================
// 👉 Netlify uses VITE_API_BASE_URL (production)
// 👉 Fallback is local development
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5500";

// ============================
// Axios instance
// ============================
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ============================
// Attach JWT token automatically
// ============================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
