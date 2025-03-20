import React, { useState } from 'react';
import { BarChart3, Download, Filter, Users } from 'lucide-react';
import { RiskLevel } from '../types';

export const Reports: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('30');

  // Mock data - would come from your API/database
  const reportData = {
    totalEmployees: 150,
    completedAssessments: 120,
    departments: ['IT', 'HR', 'Sales', 'Marketing', 'Operations'],
    riskDistribution: {
      [RiskLevel.LOW]: 70,
      [RiskLevel.MEDIUM]: 40,
      [RiskLevel.HIGH]: 10
    },
    departmentRisks: {
      'IT': { low: 20, medium: 10, high: 2 },
      'HR': { low: 15, medium: 8, high: 1 },
      'Sales': { low: 12, medium: 10, high: 3 },
      'Marketing': { low: 13, medium: 7, high: 2 },
      'Operations': { low: 10, medium: 5, high: 2 }
    }
  };

  const handleExportPDF = () => {
    // PDF export logic would go here
    console.log('Exporting PDF...');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-light text-gray-900 mb-2">Reportes y Análisis</h1>
            <p className="text-gray-500">Evaluación NOM-035-STPS-2018</p>
          </div>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
          >
            <Download className="w-5 h-5" strokeWidth={1.5} />
            <span>Exportar PDF</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_0_40px_-12px_rgb(0,0,0,0.1)] backdrop-blur-xl">
          <div className="flex items-center gap-6">
            <Filter className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            >
              <option value="all">Todos los departamentos</option>
              {reportData.departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            >
              <option value="30">Últimos 30 días</option>
              <option value="90">Últimos 90 días</option>
              <option value="180">Últimos 6 meses</option>
              <option value="365">Último año</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-[0_0_40px_-12px_rgb(0,0,0,0.1)] backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-50">
              <Users className="w-6 h-6 text-blue-500" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Empleados</p>
              <p className="text-2xl font-light text-gray-900">{reportData.totalEmployees}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-[0_0_40px_-12px_rgb(0,0,0,0.1)] backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-50">
              <BarChart3 className="w-6 h-6 text-green-500" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Evaluaciones Completadas</p>
              <p className="text-2xl font-light text-gray-900">{reportData.completedAssessments}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-[0_0_40px_-12px_rgb(0,0,0,0.1)] backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-yellow-50">
              <BarChart3 className="w-6 h-6 text-yellow-500" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Participación</p>
              <p className="text-2xl font-light text-gray-900">
                {Math.round((reportData.completedAssessments / reportData.totalEmployees) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-8 shadow-[0_0_40px_-12px_rgb(0,0,0,0.1)] backdrop-blur-xl">
          <h2 className="text-2xl font-light text-gray-900 mb-6">Distribución de Riesgo</h2>
          <div className="space-y-6">
            {Object.entries(reportData.riskDistribution).map(([level, count]) => (
              <div key={level}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">{level}</span>
                  <span className="text-gray-500">{count} empleados</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      level === RiskLevel.LOW
                        ? 'bg-green-500'
                        : level === RiskLevel.MEDIUM
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${(count / reportData.completedAssessments) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-[0_0_40px_-12px_rgb(0,0,0,0.1)] backdrop-blur-xl">
          <h2 className="text-2xl font-light text-gray-900 mb-6">Riesgo por Departamento</h2>
          <div className="space-y-6">
            {Object.entries(reportData.departmentRisks).map(([dept, risks]) => (
              <div key={dept}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700">{dept}</span>
                  <div className="flex gap-4">
                    <span className="text-green-500 text-sm">{risks.low}</span>
                    <span className="text-yellow-500 text-sm">{risks.medium}</span>
                    <span className="text-red-500 text-sm">{risks.high}</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${(risks.low / (risks.low + risks.medium + risks.high)) * 100}%` }}
                  />
                  <div
                    className="h-full bg-yellow-500"
                    style={{ width: `${(risks.medium / (risks.low + risks.medium + risks.high)) * 100}%` }}
                  />
                  <div
                    className="h-full bg-red-500"
                    style={{ width: `${(risks.high / (risks.low + risks.medium + risks.high)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};