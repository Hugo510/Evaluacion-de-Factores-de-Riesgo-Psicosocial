import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Mail, AlertCircle, Loader2 } from "lucide-react";
import { PasswordInput } from "./ui/Passwordinput";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const navigate = useNavigate();
  const location = useLocation();

  // Extraer estado de autenticación del store
  const { login, error, isLoading, clearError, user } = useAuthStore();

  // Obtener la ruta a la que redirigir después del login
  const from = (location.state as { from?: string })?.from || "/dashboard";

  // Efecto para limpiar errores al montar y desmontar
  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

  // Redireccionar si ya está autenticado
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  // Validación del formulario
  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email) {
      errors.email = "El correo electrónico es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Formato de correo electrónico inválido";
    }

    if (!password) {
      errors.password = "La contraseña es obligatoria";
    } else if (password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Limpiar errores previos
    clearError();

    // Validar formulario
    if (!validateForm()) return;

    try {
      // Intentar login
      const response = await login(email, password);

      // Redireccionar en caso de éxito
      if (response && response.user) {
        navigate(from, { replace: true });
      }
    } catch (err) {
      // Error manejado por el store, no es necesario hacer nada aquí
      console.error("Error de inicio de sesión:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.08] to-blue-600/[0.12] rounded-[2rem] blur-3xl -z-10" />
        <div className="relative bg-white/70 backdrop-blur-xl rounded-[2rem] p-12 shadow-[0_0_80px_-12px_rgb(0,0,0,0.05)]">
          <h2 className="text-3xl font-light text-gray-900 mb-8 text-center tracking-tight">
            Iniciar Sesión
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-500 text-sm flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <div className="flex-1">{error}</div>
              <button
                onClick={clearError}
                className="ml-2 text-red-400 hover:text-red-600 flex-shrink-0"
                aria-label="Cerrar mensaje de error"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formErrors.email) {
                      setFormErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                    formErrors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
                  } focus:ring transition-all duration-200`}
                  placeholder="usuario@empresa.com"
                  aria-invalid={!!formErrors.email}
                  aria-describedby={
                    formErrors.email ? "email-error" : undefined
                  }
                />
              </div>
              {formErrors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-500">
                  {formErrors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <PasswordInput
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={formErrors.password}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-70 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </button>

            <div className="text-center mt-4 text-gray-600 text-sm">
              ¿No tienes una cuenta?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Regístrate
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
