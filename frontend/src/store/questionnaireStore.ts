import { create } from "zustand";
import {
  questionnaireService,
  CreateQuestionnaireInput,
  SubmitResponseInput,
  AnswerInput,
  QuestionnaireResponseResult,
} from "../services/questionnaireService";
import { Questionnaire, Response } from "../types";

interface QuestionnaireState {
  questionnaires: Questionnaire[] | null;
  currentQuestionnaire: Questionnaire | null;
  userResponses: Response[] | null;
  latestResponse: QuestionnaireResponseResult | null; // Nueva propiedad para el resultado más reciente
  isLoading: boolean;
  error: string | null;

  // Acciones para cuestionarios
  loadQuestionnaires: () => Promise<void>;
  loadQuestionnaire: (id: number) => Promise<void>;
  createQuestionnaire: (data: CreateQuestionnaireInput) => Promise<void>;

  // Acciones para respuestas
  submitResponse: (
    questionnaireId: number,
    answers: Record<number, number>
  ) => Promise<QuestionnaireResponseResult | null>;
  loadUserResponses: (userId: number) => Promise<void>;

  clearError: () => void;
}

export const useQuestionnaireStore = create<QuestionnaireState>((set) => ({
  questionnaires: null,
  currentQuestionnaire: null,
  userResponses: null,
  latestResponse: null, // Inicializamos como null
  isLoading: false,
  error: null,

  // Cargar todos los cuestionarios
  loadQuestionnaires: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await questionnaireService.getAll();
      set({ questionnaires: data, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Error al cargar cuestionarios",
        isLoading: false,
      });
    }
  },

  // Cargar un cuestionario específico
  loadQuestionnaire: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      const data = await questionnaireService.getById(id);
      set({ currentQuestionnaire: data, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Error al cargar el cuestionario",
        isLoading: false,
      });
    }
  },

  // Crear un nuevo cuestionario
  createQuestionnaire: async (data: CreateQuestionnaireInput) => {
    try {
      set({ isLoading: true, error: null });
      const newQuestionnaire = await questionnaireService.create(data);
      set((state) => ({
        questionnaires: state.questionnaires
          ? [...state.questionnaires, newQuestionnaire]
          : [newQuestionnaire],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Error al crear el cuestionario",
        isLoading: false,
      });
    }
  },

  // Enviar respuesta a un cuestionario
  submitResponse: async (
    questionnaireId: number,
    answersRecord: Record<number, number>
  ) => {
    try {
      set({ isLoading: true, error: null });

      // Validar que haya al menos una respuesta
      const answersEntries = Object.entries(answersRecord);
      if (answersEntries.length === 0) {
        throw new Error("Debe enviar al menos una respuesta");
      }

      // Convertir de Record<number, number> al formato esperado por la API
      const answers: AnswerInput[] = answersEntries.map(
        ([questionId, value]) => ({
          questionId: parseInt(questionId),
          value,
        })
      );

      // Estructura final que espera el backend según el schema
      const input: SubmitResponseInput = {
        questionnaireId,
        answers,
      };

      // Enviar la respuesta y guardar el resultado
      const result = await questionnaireService.submitResponse(input);

      // Guardar el resultado en el estado
      set({
        latestResponse: result,
        isLoading: false,
      });

      return result;
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Error al enviar las respuestas",
        isLoading: false,
      });
      return null;
    }
  },

  // Cargar respuestas de un usuario
  loadUserResponses: async (userId: number) => {
    try {
      set({ isLoading: true, error: null });
      const data = await questionnaireService.getUserResponses(userId);
      set({ userResponses: data, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Error al cargar las respuestas del usuario",
        isLoading: false,
      });
    }
  },

  // Limpiar errores
  clearError: () => set({ error: null }),
}));
