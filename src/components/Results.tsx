import React from 'react';
import { BarChart3, AlertTriangle, CheckCircle } from 'lucide-react';
import { RiskLevel } from '../types';

export const Results: React.FC = () => {
  // This would typically come from your state management or API
  const mockResults = {
    riskLevel: RiskLevel.MEDIUM,
    categories: {
      "Ambiente de trabajo": 3.5,
      "Factores propios": 2.8,
      "Organización del tiempo": 4.2,
      "Liderazgo": 3.0,
      "Entorno organizacional": 2.5
    },
    recommendations: [
      "Implementar pausas activas durante la jornada laboral",
      "Revisar la distribución de cargas de trabajo",
      "Mejorar la comunicación entre equipos"
    ]
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW:
        return 'text-green-500';
      case RiskLevel.MEDIUM:
        return 'text-yellow-500';
      case RiskLevel.HIGH:
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW:
        return <CheckCircle className="w-8 h-8 text-green-500" strokeWidth={1.5} />;
      case RiskLevel.MEDIUM:
        return <AlertTriangle className="w-8 h-8 text-yellow-500" strokeWidth={1.5} />;
      case RiskLevel.HIGH:
        return <AlertTriangle className="w-8 h-8 text-red-500" strokeWidth={1.5} />;
      default:
        return <BarChart3 className="w-8 h-8 text-gray-500" strokeWidth={1.5} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-2">Resultados de la Evaluación</h1>
          <p className="text-gray-500">NOM-035-STPS-2018</p>
        </div>

        <div className="grid gap-8">
          {/* Risk Level Summary */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_0_40px_-12px_rgb(0,0,0,0.1)] backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-6">
              {getRiskIcon(mockResults.riskLevel)}
              <div>
                <h2 className="text-2xl font-light text-gray-900">Nivel de Riesgo</h2>
                <p className={`text-lg ${getRiskColor(mockResults.riskLevel)}`}>
                  {mockResults.riskLevel}
                </p>
              </div>
            </div>
          </div>

          {/* Category Scores */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_0_40px_-12px_rgb(0,0,0,0.1)] backdrop-blur-xl">
            <h2 className="text-2xl font-light text-gray-900 mb-6">Resultados por Categoría</h2>
            <div className="space-y-6">
              {Object.entries(mockResults.categories).map(([category, score]) => (
                <div key={category}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-700">{category}</span>
                    <span className="text-gray-500">{score.toFixed(1)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                      style={{ width: `${(score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_0_40px_-12px_rgb(0,0,0,0.1)] backdrop-blur-xl">
            <h2 className="text-2xl font-light text-gray-900 mb-6">Recomendaciones</h2>
            <ul className="space-y-4">
              {mockResults.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <CheckCircle className="w-5 h-5 text-blue-500" strokeWidth={1.5} />
                  </div>
                  <p className="text-gray-700">{recommendation}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};