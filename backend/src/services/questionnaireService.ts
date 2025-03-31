// src/services/questionnaireService.ts
import prisma from "../config/db";
import { CreateQuestionnaireInput } from "../schemas/questionnaireSchemas";

export class QuestionnaireService {
  /**
   * Obtiene todos los cuestionarios, incluyendo sus preguntas.
   */
  static async getAllQuestionnaires() {
    return prisma.questionnaire.findMany({
      include: { questions: true },
    });
  }

  /**
   * Obtiene un cuestionario por su ID, incluyendo sus preguntas.
   * @param id ID del cuestionario.
   */
  static async getQuestionnaireById(id: number) {
    return prisma.questionnaire.findUnique({
      where: { id },
      include: { questions: true },
    });
  }

  /**
   * Crea un nuevo cuestionario con las preguntas asociadas.
   * @param input Datos para crear el cuestionario.
   */
  static async createQuestionnaire(input: CreateQuestionnaireInput) {
    return prisma.questionnaire.create({
      data: {
        title: input.title,
        description: input.description ?? "", // Provide default empty string if undefined
        questions: {
          create: input.questions,
        },
      },
      include: { questions: true },
    });
  }
}
