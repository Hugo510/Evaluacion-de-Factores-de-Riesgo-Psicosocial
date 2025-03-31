import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Role } from '../types';
import { BarChart3, Users, FileText, AlertTriangle } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  const stats = {
    totalUsers: 150,
    totalResponses: 120,
    riskDistribution: { low: 70, medium: 40, high: 10 }
  };

  if (user?.role === Role.ADMIN) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-2">Dashboard Administrativo</h1>
          <p className="text-gray-500">Monitoreo general de la evaluación NOM-035</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { 
              title: "Total Empleados",
              value: stats.totalUsers,
              icon: Users,
              color: "blue"
            },
            {
              title: "Evaluaciones Completadas",
              value: stats.totalResponses,
              icon: FileText,
              color: "green"
            },
            {
              title: "Riesgo Alto",
              value: stats.riskDistribution.high,
              icon: AlertTriangle,
              color: "red"
            },
            {
              title: "Participación",
              value: `${Math.round((stats.totalResponses / stats.totalUsers) * 100)}%`,
              icon: BarChart3,
              color: "purple"
            }
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-[0_0_40px_-12px_rgb(0,0,0,0.1)] backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${stat.color}-50`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color}-500`} strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
              <p className="text-3xl font-light text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-[0_0_40px_-12px_rgb(0,0,0,0.1)] backdrop-blur-xl">
            <h3 className="text-xl font-light text-gray-900 mb-6">Distribución de Riesgo</h3>
            {/* Chart component will go here */}
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-[0_0_40px_-12px_rgb(0,0,0,0.1)] backdrop-blur-xl">
            <h3 className="text-xl font-light text-gray-900 mb-6">Departamentos</h3>
            {/* Department list will go here */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-light text-gray-900 mb-2">Mi Dashboard</h1>
        <p className="text-gray-500">Evaluación de Riesgos Psicosociales NOM-035</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-[0_0_40px_-12px_rgb(0,0,0,0.1)] backdrop-blur-xl mb-8">
          <h3 className="text-xl font-light text-gray-900 mb-6">Mi Evaluación</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-2">Estado actual</p>
              <p className="text-2xl font-light text-gray-900">Pendiente</p>
            </div>
            <a
              href="/questionnaire"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
            >
              Iniciar Evaluación
            </a>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-[0_0_40px_-12px_rgb(0,0,0,0.1)] backdrop-blur-xl">
          <h3 className="text-xl font-light text-gray-900 mb-6">Mis Resultados Anteriores</h3>
          <p className="text-gray-500 text-center py-8">No hay evaluaciones previas</p>
        </div>
      </div>
    </div>
  );
};