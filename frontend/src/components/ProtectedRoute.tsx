import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Role } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles
}) => {
  const { user, isLoading, token } = useAuthStore();
  const location = useLocation();

  // Si está cargando, mostrar un indicador de carga
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  // Si no hay usuario o token, redirigir al login
  if (!user || !token) {
    // Guardar la ubicación actual para redirigir después del login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Si hay roles permitidos y el usuario no tiene el rol adecuado, redirigir a la página principal
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Si todo está bien, mostrar el componente hijo
  return <>{children}</>;
};