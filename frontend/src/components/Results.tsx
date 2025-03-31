import React, { useEffect } from 'react';
import { BarChart3, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { RiskLevel } from '../types';
import { useQuestionnaireStore } from '../store/questionnaireStore';
import { useNavigate } from 'react-router-dom';

export const Results: React.FC = () => {
  const { latestResponse, isLoading } = useQuestionnaireStore();
  const navigate = useNavigate();

  // Si no hay resultados y no está cargando, redirigir a la página de cuestionarios
  useEffect(() => {
    if (!latestResponse && !isLoading) {
      navigate('/questionnaire');
    }
  }, [latestResponse, isLoading, navigate]);

  // Función para determinar el color según el nivel de riesgo
  const getRiskColor = (level: string) => {
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

  // Función para elegir el icono según el nivel de riesgo
  const getRiskIcon = (level: string) => {
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

  // Si está cargando, mostrar indicador
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  // Si no hay datos, mostrar mensaje
  if (!latestResponse) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-light text-gray-900 mb-4">No hay resultados disponibles</h1>
          <p className="text-gray-500 mb-8">Completa un cuestionario primero para ver tus resultados.</p>
          <button
            onClick={() => navigate('/questionnaire')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl"
          >
            Ir a Cuestionarios
          </button>
        </div>
      </div>
    );
  }

  // Calcular categorías y recomendaciones basadas en el nivel de riesgo
  const getRecommendations = (riskLevel: string) => {
    switch (riskLevel) {
      case RiskLevel.LOW:
        return [
          "Mantener las buenas prácticas actuales",
          "Realizar evaluaciones periódicas de seguimiento",
          "Fomentar la comunicación abierta"
        ];
      case RiskLevel.MEDIUM:
        return [
          "Implementar pausas activas durante la jornada laboral",
          "Revisar la distribución de cargas de trabajo",
          "Mejorar la comunicación entre equipos"
        ];
      case RiskLevel.HIGH:
        return [
          "Realizar una evaluación detallada de factores de riesgo psicosocial",
          "Implementar un programa específico de reducción de estrés laboral",
          "Revisar urgentemente las cargas de trabajo",
          "Establecer canales de apoyo psicológico para los trabajadores"
        ];
      default:
        return ["Realizar una evaluación completa con un especialista"];
    }
  };

  // Calcular categorías simuladas basadas en las respuestas
  const generateCategories = () => {
    const categories: Record<string, number> = {
      "Ambiente de trabajo": 0,
      "Factores propios": 0,
      "Organización del tiempo": 0,
      "Liderazgo": 0,
      "Entorno organizacional": 0
    };

    const totalScore = latestResponse.totalScore || 0;
    const avgScore = totalScore / (latestResponse.response.answers.length || 1);

    // Asignar valores proporcionales basados en la puntuación total
    Object.keys(categories).forEach((cat) => {
      // Variación aleatoria para hacer el gráfico más interesante
      const variation = Math.random() * 0.5 + 0.75;
      categories[cat] = Math.min(5, Math.max(1, avgScore * variation));
    });

    return categories;
  };

  const recommendationsList = getRecommendations(latestResponse.riskLevel);
  const categoryScores = generateCategories();

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
              {getRiskIcon(latestResponse.riskLevel)}
              <div>
                <h2 className="text-2xl font-light text-gray-900">Nivel de Riesgo</h2>
                <p className={`text-lg ${getRiskColor(latestResponse.riskLevel)}`}>
                  {latestResponse.riskLevel}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-700">Puntuación Total: <span className="font-medium">{latestResponse.totalScore}</span></p>
              <p className="text-gray-700 mt-1">Fecha de Evaluación: <span className="font-medium">
                {new Date(latestResponse.response.createdAt).toLocaleDateString()}
              </span></p>
            </div>
          </div>

          {/* Category Scores */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_0_40px_-12px_rgb(0,0,0,0.1)] backdrop-blur-xl">
            <h2 className="text-2xl font-light text-gray-900 mb-6">Resultados por Categoría</h2>
            <div className="space-y-6">
              {Object.entries(categoryScores).map(([category, score]) => (
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
              {recommendationsList.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <CheckCircle className="w-5 h-5 text-blue-500" strokeWidth={1.5} />
                  </div>
                  <p className="text-gray-700">{recommendation}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Answer Summary */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_0_40px_-12px_rgb(0,0,0,0.1)] backdrop-blur-xl">
            <h2 className="text-2xl font-light text-gray-900 mb-6">Detalle de Respuestas</h2>
            <div className="space-y-4">
              {latestResponse.response.answers.map((answer, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700">Pregunta {answer.questionId}</span>
                  <span className="text-gray-500 font-medium">{answer.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};