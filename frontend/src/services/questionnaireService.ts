import api from "../lib/api";
import { Questionnaire, Question, Response } from "../types";

export interface CreateQuestionnaireInput {
  title: string;
  description: string;
  questions: Omit<Question, "id" | "questionnaireId">[];
}

// Interfaces para el envío de respuestas según el schema del backend
export interface AnswerInput {
  questionId: number;
  value: number;
}

export interface SubmitResponseInput {
  questionnaireId: number;
  answers: AnswerInput[];
}

export interface QuestionnaireResponseResult {
  response: {
    id: number;
    userId: number;
    questionnaireId: number;
    answers: AnswerInput[];
    riskLevel: string;
    createdAt: string;
    updatedAt?: string;
  };
  totalScore: number;
  riskLevel: string;
}

export const questionnaireService = {
  // Obtener todos los cuestionarios
  getAll: async (): Promise<Questionnaire[]> => {
    const response = await api.get<Questionnaire[]>("/questionnaires");
    return response.data;
  },

  // Obtener un cuestionario por ID
  getById: async (id: number): Promise<Questionnaire> => {
    const response = await api.get<Questionnaire>(`/questionnaires/${id}`);
    return response.data;
  },

  // Crear un nuevo cuestionario (requiere autenticación)
  create: async (data: CreateQuestionnaireInput): Promise<Questionnaire> => {
    const response = await api.post<Questionnaire>("/questionnaires", data);
    return response.data;
  },

  // DEPRECADO: Las preguntas ya vienen incluidas en el cuestionario
  // Mantener por compatibilidad pero ya no es necesario usar este método
  getQuestions: async (id: number): Promise<Question[]> => {
    console.warn(
      "getQuestions está deprecado. Las preguntas ya vienen incluidas en el cuestionario."
    );
    const response = await api.get<Question[]>(
      `/questionnaires/${id}/questions`
    );
    return response.data;
  },

  // Enviar respuestas a un cuestionario
  submitResponse: async (
    input: SubmitResponseInput
  ): Promise<QuestionnaireResponseResult> => {
    try {
      // Verificar que la estructura cumple con el requisito mínimo
      if (!input.answers || input.answers.length === 0) {
        throw new Error("Debe enviar al menos una respuesta");
      }

      const response = await api.post<QuestionnaireResponseResult>(
        "/responses",
        input
      );
      return response.data;
    } catch (error) {
      console.error("Error al enviar respuestas:", error);
      throw error;
    }
  },

  // Obtener respuestas de un usuario
  getUserResponses: async (userId: number): Promise<Response[]> => {
    const response = await api.get<Response[]>(`/users/${userId}/responses`);
    return response.data;
  },
};
