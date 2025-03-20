// src/services/responseService.ts
import prisma from "../config/db";
import { RiskCalculationService } from "./riskCalculationService";
import { SubmitResponseInput } from "../schemas/responseSchemas";

export class ResponseService {
  /**
   * Procesa el envío de respuestas, calcula el nivel de riesgo y crea el registro en la base de datos.
   * @param userId ID del usuario que envía las respuestas.
   * @param input Objeto con los datos del cuestionario y respuestas.
   * @returns Objeto con el registro creado y detalles del riesgo.
   */
  static async submitResponse(userId: number, input: SubmitResponseInput) {
    // Calcular el riesgo basado en las respuestas usando el servicio dedicado.
    const { totalScore, riskLevel } = RiskCalculationService.calculateRisk(
      input.answers
    );

    // Crear el registro de respuesta en la base de datos.
    const responseRecord = await prisma.response.create({
      data: {
        userId,
        questionnaireId: input.questionnaireId,
        answers: input.answers, // Se almacena como JSON.
        riskLevel,
      },
    });

    return {
      response: responseRecord,
      totalScore,
      riskLevel,
    };
  }
}
