import api from "../lib/api";
import { Questionnaire, Question, Response } from "../types";

export const questionnaireService = {
  getAll: async (): Promise<Questionnaire[]> => {
    const response = await api.get<Questionnaire[]>("/questionnaires");
    return response.data;
  },

  getById: async (id: number): Promise<Questionnaire> => {
    const response = await api.get<Questionnaire>(`/questionnaires/${id}`);
    return response.data;
  },

  getQuestions: async (id: number): Promise<Question[]> => {
    const response = await api.get<Question[]>(
      `/questionnaires/${id}/questions`
    );
    return response.data;
  },

  submitResponse: async (
    questionnaireId: number,
    answers: Record<number, number>
  ): Promise<Response> => {
    const response = await api.post<Response>(
      `/questionnaires/${questionnaireId}/responses`,
      { answers }
    );
    return response.data;
  },

  getUserResponses: async (userId: number): Promise<Response[]> => {
    const response = await api.get<Response[]>(`/users/${userId}/responses`);
    return response.data;
  },
};
