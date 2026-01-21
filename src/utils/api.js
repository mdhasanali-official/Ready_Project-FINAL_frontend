// src/utils/api.js
import axios from "axios";
import { toast } from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_DataHost || "http://localhost:5000",
});

api.interceptors.request.use(
  (config) => {
    let token = null;

    if (config.url.includes("/admin")) {
      token = localStorage.getItem("adminToken");
    } else {
      token = localStorage.getItem("userToken");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message || "";

      if (
        errorMessage.includes("Token") ||
        errorMessage.includes("expired") ||
        errorMessage.includes("invalid") ||
        errorMessage.includes("token")
      ) {
        handleLogout(error.config.url);
        toast.error("Session expired! Please login again.");
      }
    }

    if (error.response?.status === 403) {
      toast.error(error.response?.data?.message || "Access denied!");
      handleLogout(error.config.url);
    }

    return Promise.reject(error);
  },
);

const handleLogout = (url) => {
  if (url.includes("/admin")) {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin";
  } else {
    localStorage.removeItem("userToken");
    window.location.href = "/login";
  }
};

export default api;
