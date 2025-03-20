import axios from "axios";
import { useAuthStore } from "../store/authStore";

// Configuración base de axios
// Asegurar que esta URL coincida exactamente con donde se está ejecutando tu backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Crear instancia de axios con configuración común
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // Agregar withCredentials para enviar cookies en solicitudes cross-origin
  withCredentials: true,
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

// Mejorar el interceptor para manejar errores de respuesta con más detalle
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error en petición API:", error);

    // Si hay un problema de red o el servidor no está disponible
    if (!error.response) {
      console.error(
        "No se pudo conectar al servidor. Verifique su conexión o si el servidor está en ejecución"
      );
    }

    // Manejo de errores específicos por código
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Limpiar el token del store en caso de error de autenticación
          useAuthStore.getState().setToken(null);
          console.error("Error de autenticación: No autorizado");
          break;
        case 403:
          console.error("Error de permisos: Acceso prohibido");
          break;
        case 404:
          console.error(`Recurso no encontrado: ${error.config.url}`);
          break;
        case 500:
          console.error("Error del servidor");
          break;
        default:
          console.error(
            `Error: ${error.response.status} - ${error.response.statusText}`
          );
      }
    }

    return Promise.reject(error);
  }
);

export default api;
