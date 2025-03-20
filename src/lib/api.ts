import axios from "axios";
import { useAuthStore } from "../store/authStore";

// Configuración base de axios
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Crear instancia de axios con configuración común
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor para añadir el token de autenticación desde el store
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo de errores común (401, 403, etc.)
    if (error.response && error.response.status === 401) {
      // Limpiar el token del store en caso de error de autenticación
      useAuthStore.getState().setToken(null);
    }
    return Promise.reject(error);
  }
);

export default api;
