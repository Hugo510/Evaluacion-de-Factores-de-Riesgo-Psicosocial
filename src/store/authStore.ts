import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/authService";
import { AuthState } from "../types";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      setToken: (token: string | null) => set({ token }),

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });

          const authData = await authService.login(email, password);

          // Guardar datos de autenticación en el store
          set({
            user: authData.user,
            token: authData.token,
            isLoading: false,
          });

          // Retornar authData para cumplir con el tipo Promise<AuthResponse>
          return authData;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Error de inicio de sesión";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (userData) => {
        try {
          set({ isLoading: true, error: null });

          const authData = await authService.register(userData);

          // Guardar datos de autenticación en el store
          set({
            user: authData.user,
            token: authData.token,
            isLoading: false,
          });

          return authData;
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Error al registrar usuario";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true, error: null });
          await authService.logout();
          set({ user: null, token: null, isLoading: false });
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Error de cierre de sesión";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Método para cargar el usuario actual usando el token almacenado en el store
      loadUser: async () => {
        const token = get().token;
        if (!token) return;

        try {
          set({ isLoading: true, error: null });
          const user = await authService.getCurrentUser();
          set({ user, isLoading: false });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Error al cargar usuario";
          set({
            error: errorMessage,
            isLoading: false,
            user: null,
          });
          // Si hay error al cargar el usuario, limpiar el token del store
          set({ token: null });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage", // Nombre del almacenamiento persistente
      partialize: (state) => ({ user: state.user, token: state.token }), // Solo persistir estos campos
    }
  )
);
