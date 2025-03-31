/**
 * Datos de cuestionarios para seeding
 */

export interface QuestionSeedData {
  text: string;
  category: string;
}

export interface QuestionnaireSeedData {
  title: string;
  description: string;
  questions: QuestionSeedData[];
}

export const questionnaires: QuestionnaireSeedData[] = [
  {
    title: "Evaluación de Factores de Riesgo Psicosocial",
    description:
      "Cuestionario para evaluar factores psicosociales según la NOM-035",
    questions: [
      {
        text: "¿Mi trabajo me exige hacer mucho esfuerzo físico?",
        category: "Condiciones en el ambiente de trabajo",
      },
      {
        text: "¿Me preocupa sufrir un accidente en mi trabajo?",
        category: "Condiciones en el ambiente de trabajo",
      },
      {
        text: "¿Considero que las actividades que realizo son peligrosas?",
        category: "Condiciones en el ambiente de trabajo",
      },
      {
        text: "¿Por la cantidad de trabajo que tengo debo quedarme tiempo adicional a mi turno?",
        category: "Carga de trabajo",
      },
      {
        text: "¿Tengo que trabajar muy rápido?",
        category: "Carga de trabajo",
      },
      {
        text: "¿Mi trabajo permite que desarrolle nuevas habilidades?",
        category: "Falta de control sobre el trabajo",
      },
      {
        text: "¿Puedo decidir cuánto trabajo realizo durante la jornada laboral?",
        category: "Falta de control sobre el trabajo",
      },
      {
        text: "¿Recibo capacitación útil para hacer mi trabajo?",
        category: "Falta de control sobre el trabajo",
      },
    ],
  },
  {
    title: "Evaluación de Clima Laboral",
    description:
      "Cuestionario para evaluar el ambiente y clima laboral en la organización",
    questions: [
      {
        text: "¿Me siento parte de un equipo de trabajo?",
        category: "Pertenencia",
      },
      {
        text: "¿Mi jefe inmediato se interesa por mi bienestar?",
        category: "Liderazgo",
      },
      {
        text: "¿En mi trabajo puedo expresar mis opiniones sin represalias?",
        category: "Comunicación",
      },
      {
        text: "¿Recibo reconocimiento por mi desempeño?",
        category: "Motivación",
      },
      {
        text: "¿Tengo oportunidades de crecimiento en esta empresa?",
        category: "Desarrollo profesional",
      },
    ],
  },
];
