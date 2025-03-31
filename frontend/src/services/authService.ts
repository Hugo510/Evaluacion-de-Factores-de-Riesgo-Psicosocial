import api from "../lib/api";
import { User, Role } from "../types";

interface UserRegistrationData {
  email: string;
  password: string;
  name: string;
  role?: Role;
  department?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Definir la estructura de respuesta para getCurrentUser
interface GetCurrentUserResponse {
  success: boolean;
  user: User;
}

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>("/auth/login", {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Error detallado durante login:", error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<GetCurrentUserResponse>("/auth/me");

    if (!response.data.success) {
      throw new Error("No se pudo obtener información del usuario");
    }

    return response.data.user;
  },

  register: async (userData: UserRegistrationData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", userData);
    return response.data;
  },
};
