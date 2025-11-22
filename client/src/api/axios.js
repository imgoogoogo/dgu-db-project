import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API, // 예: http://localhost:3000
  withCredentials: false,
});

export default api;
