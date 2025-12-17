import axios from "axios";

const api = axios.create({
  baseURL:  "https://trust-market-backend-nsao.onrender.com/api",
});

// Automatically send token in every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

