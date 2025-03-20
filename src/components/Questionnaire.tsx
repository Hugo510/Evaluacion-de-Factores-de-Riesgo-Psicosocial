import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Questionnaire: React.FC = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const questions = [
    {
      id: 1,
      text: "¿Mi trabajo me exige hacer mucho esfuerzo físico?",
      category: "Condiciones en el ambiente de trabajo"
    },
    {
      id: 2,
      text: "¿Me preocupa sufrir un accidente en mi trabajo?",
      category: "Condiciones en el ambiente de trabajo"
    }
    // More questions will be added from the database
  ];

  const handleAnswer = (value: number) => {
    setAnswers(prev => ({ ...prev, [questions[currentQuestion].id]: value }));
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Submit answers and navigate to results
      navigate('/results');
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-2">Cuestionario NOM-035</h1>
          <p className="text-gray-500">Evaluación de factores de riesgo psicosocial</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-[0_0_40px_-12px_rgb(0,0,0,0.1)] backdrop-blur-xl">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-gray-500">{currentQ.category}</span>
              <span className="text-sm text-gray-500">
                Pregunta {currentQuestion + 1} de {questions.length}
              </span>
            </div>
            <h2 className="text-xl text-gray-900 mb-8">{currentQ.text}</h2>
            
            <div className="grid grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className="p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                >
                  <span className="block text-2xl font-light text-gray-900 mb-2">{value}</span>
                  <span className="block text-sm text-gray-500">
                    {value === 1 ? 'Nunca' : 
                     value === 2 ? 'Casi nunca' :
                     value === 3 ? 'Algunas veces' :
                     value === 4 ? 'Casi siempre' : 'Siempre'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};