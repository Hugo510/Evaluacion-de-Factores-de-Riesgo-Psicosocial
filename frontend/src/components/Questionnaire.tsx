import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestionnaireStore } from '../store/questionnaireStore';
import { useAuthStore } from '../store/authStore';
import { ClipboardList, ChevronRight, AlertCircle, Loader2, X } from 'lucide-react';
import { Question } from '../types';

export const Questionnaire: React.FC = () => {
  const {
    questionnaires,
    loadQuestionnaires,
    loadQuestionnaire,
    currentQuestionnaire,
    submitResponse,
    isLoading,
    error,
    clearError
  } = useQuestionnaireStore();

  const { user } = useAuthStore();

  const navigate = useNavigate();

  const [selectedQuestionnaireId, setSelectedQuestionnaireId] = useState<number | null>(null);
  const [showQuestions, setShowQuestions] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Cargar cuestionarios al montar el componente
  useEffect(() => {
    loadQuestionnaires();
  }, [loadQuestionnaires]);

  // Cargar el cuestionario seleccionado cuando se cambia el ID
  useEffect(() => {
    if (selectedQuestionnaireId) {
      loadQuestionnaire(selectedQuestionnaireId);
      setShowQuestions(true);
      setAnswers({});
      setSubmitted(false);
    } else {
      setShowQuestions(false);
    }
  }, [selectedQuestionnaireId, loadQuestionnaire]);

  // Manejar la selección de un cuestionario
  const handleSelectQuestionnaire = (id: number) => {
    setSelectedQuestionnaireId(id);
  };

  // Manejar el cambio en las respuestas
  const handleAnswerChange = (questionId: number, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Enviar respuestas
  const handleSubmit = async () => {
    if (!selectedQuestionnaireId || !user) return;

    try {
      // Verificar que haya al menos una respuesta antes de enviar
      if (Object.keys(answers).length === 0) {
        console.error("Debe responder al menos una pregunta");
        return;
      }

      // Pasar el ID del cuestionario y el objeto de respuestas al store
      // que se encargará de transformarlo al formato correcto
      const result = await submitResponse(selectedQuestionnaireId, answers);

      if (result) {
        // Si hay un resultado exitoso, redirigir a la página de resultados
        navigate('/results');
      } else {
        // Si no hay resultado, mostrar como enviado pero no redirigir
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Error al enviar respuestas:", error);
    }
  };

  // Volver a la lista de cuestionarios
  const handleBackToList = () => {
    setSelectedQuestionnaireId(null);
    setShowQuestions(false);
    setAnswers({});
    setSubmitted(false);
  };

  // Verificar si todas las preguntas han sido respondidas
  const areAllQuestionsAnswered = (): boolean => {
    if (!currentQuestionnaire || !currentQuestionnaire.questions) return false;
    return currentQuestionnaire.questions.every(question => answers[question.id] !== undefined);
  };

  return (
    <div className="container mx-auto px-4 py-12">
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

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      )}

      {!showQuestions ? (
        // Lista de cuestionarios disponibles
        <div>
          <h1 className="text-4xl font-light text-gray-900 mb-8 tracking-tight">
            Evaluaciones Disponibles
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questionnaires?.map(questionnaire => (
              <div
                key={questionnaire.id}
                className="bg-white rounded-2xl p-6 shadow-[0_0_40px_-12px_rgb(0,0,0,0.1)] backdrop-blur-xl hover:shadow-lg transition-all duration-200 cursor-pointer"
                onClick={() => questionnaire.id !== undefined && handleSelectQuestionnaire(questionnaire.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-xl bg-blue-50">
                    <ClipboardList className="w-6 h-6 text-blue-500" strokeWidth={1.5} />
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
                <h2 className="text-xl font-medium mt-4 mb-2">{questionnaire.title}</h2>
                <p className="text-gray-600 text-sm">{questionnaire.description}</p>
              </div>
            ))}
          </div>

          {(!questionnaires || questionnaires.length === 0) && !isLoading && (
            <div className="text-center py-10 text-gray-500">
              No hay cuestionarios disponibles en este momento.
            </div>
          )}
        </div>
      ) : (
        // Vista del cuestionario seleccionado
        <div className="bg-white rounded-2xl p-8 shadow-[0_0_40px_-12px_rgb(0,0,0,0.1)] backdrop-blur-xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-light text-gray-900">{currentQuestionnaire?.title}</h1>
            <button
              onClick={handleBackToList}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <p className="text-gray-600 mb-8">{currentQuestionnaire?.description}</p>

          {submitted ? (
            <div className="text-center py-8">
              <div className="bg-green-50 p-6 rounded-xl mb-6 inline-block">
                <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-medium text-gray-900 mb-2">¡Evaluación Enviada!</h2>
              <p className="text-gray-600 mb-6">Gracias por completar el cuestionario.</p>
              <button
                onClick={handleBackToList}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
              >
                Volver a la lista
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-8 mb-8">
                {currentQuestionnaire?.questions?.map((question: Question) => (
                  <div key={question.id} className="border border-gray-100 rounded-xl p-6">
                    <h3 className="text-lg font-medium mb-4">{question.text}</h3>
                    <p className="text-sm text-gray-500 mb-4">Categoría: {question.category}</p>

                    <div className="flex flex-col space-y-3">
                      {[1, 2, 3, 4, 5].map(value => (
                        <label
                          key={value}
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={value}
                            checked={answers[question.id] === value}
                            onChange={() => handleAnswerChange(question.id, value)}
                            className="w-4 h-4 text-blue-500 focus:ring-blue-400"
                          />
                          <span className="text-gray-700">
                            {value === 1 && "Nunca"}
                            {value === 2 && "Casi nunca"}
                            {value === 3 && "A veces"}
                            {value === 4 && "Casi siempre"}
                            {value === 5 && "Siempre"}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={!areAllQuestionsAnswered() || isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Enviando...
                    </>
                  ) : (
                    'Enviar respuestas'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};