import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "https://ats-resume-builder1.onrender.com",
});

export default api;
