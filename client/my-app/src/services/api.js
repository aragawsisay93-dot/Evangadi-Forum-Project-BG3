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

// ✅ Production base (Netlify env) should include /api
// Example: https://evangadi-forum-project-bg3-production.up.railway.app/api
const baseURL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5500";

// ✅ Ensure /api is included (avoid /user/login mistakes)
const apiBase = baseURL.endsWith("/api") ? baseURL : `${baseURL}/api`;

const api = axios.create({
  baseURL: apiBase,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // ✅ JWT in headers; set true ONLY if using cookies
});

// ✅ Attach JWT token automatically
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
