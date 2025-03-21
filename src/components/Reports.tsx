import React, { useEffect } from 'react';
import { BarChart3, Download, Filter, Users } from 'lucide-react';
import { useReportStore } from '../store/reportStore';
import { DepartmentReport } from '../services/reportService';

export const Reports: React.FC = () => {
  const { departmentReports, loadDepartmentReports, isLoading, error, loadUserReport, userReport } = useReportStore();

  useEffect(() => {
    loadDepartmentReports();
  }, [loadDepartmentReports]);

  // Se usan los datos del store, que ya incluyen la simulación si es necesario
  const reportData: DepartmentReport[] | null = departmentReports;

  const getTotalEmployees = (): number => {
    if (!reportData) return 0;
    return reportData.reduce((acc, cur) => acc + cur.totalResponses, 0);
  };

  const getParticipationRate = (): string => {
    // No se puede calcular la tasa de participación sin datos simulados
    return '5';
  };

  const handleLoadUserReport = async () => {
    try {
      // Implementar lógica para cargar el reporte del usuario
      await loadUserReport(1); // ID del usuario quemado para pruebas
    } catch (error) {
      console.error("Error al cargar el reporte:", error);
    }
  };

  const handleDownloadPdf = () => {
    if (!userReport) return;

    // Crear un enlace temporal para descargar el PDF
    const url = window.URL.createObjectURL(userReport.pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', userReport.filename);
    document.body.appendChild(link);
    link.click();

    // Limpieza
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {error && <div className="mb-4 text-red-500">{error}</div>}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-light text-gray-900 mb-2">Reportes y Análisis</h1>
            <p className="text-gray-500">Evaluación NOM-035-STPS-2018</p>
          </div>
          <div>
            <button
              onClick={handleLoadUserReport}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 mb-4"
            >
              <Download className="w-5 h-5" strokeWidth={1.5} />
              <span>Cargar Reporte Usuario</span>
            </button>
          </div>
        </div>

        {/* Filtros (simulados) */}
        <div className="bg-white rounded-2xl p-6 shadow-[0_0_40px_-12px_rgb(0,0,0,0.1)] backdrop-blur-xl">
          <div className="flex items-center gap-6">
            <Filter className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
            <select
              className="px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all duration-200"
            >
              <option value="all">Todos los departamentos</option>
              {reportData?.map((dept) => (
                <option key={dept.department} value={dept.department}>
                  {dept.department}
                </option>
              ))}
            </select>
            <select
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
              <p className="text-2xl font-light text-gray-900">
                {getTotalEmployees()}
              </p>
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
              <p className="text-2xl font-light text-gray-900">10</p>
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
                {getParticipationRate()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Secciones de distribución de riesgo – se pueden actualizar según los datos reales */}
      <div className="bg-white rounded-2xl p-8 shadow-[0_0_40px_-12px_rgb(0,0,0,0.1)] backdrop-blur-xl">
        <h2 className="text-2xl font-light text-gray-900 mb-6">Total de respuestas por departamento</h2>
        <div className="space-y-6">
          {reportData?.map((dept) => (
            <div key={dept.department}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">{dept.department}</span>
                <span className="text-gray-500">{dept.totalResponses} respuestas</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mostrar opción para descargar el reporte del usuario */}
      {userReport && (
        <div className="mt-8 bg-white rounded-2xl p-8 shadow-[0_0_40px_-12px_rgb(0,0,0,0.1)] backdrop-blur-xl">
          <h2 className="text-2xl font-light text-gray-900 mb-6">Reporte del Usuario</h2>
          <p className="text-gray-600 mb-4">El reporte ha sido generado correctamente.</p>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
          >
            <Download className="w-5 h-5" strokeWidth={1.5} />
            <span>Descargar PDF</span>
          </button>
        </div>
      )}
    </div>
  );
};