/**
 * Script para sembrar respuestas de cuestionarios en la base de datos
 */
import { PrismaClient, Response, RiskLevel } from "@prisma/client";
import { executeSeedWithTransaction } from "../utils";
import logger from "../../../src/config/logger";

export default async function seedResponses(
  prisma: PrismaClient
): Promise<Response[]> {
  return executeSeedWithTransaction(prisma, "response", async () => {
    // Obtener usuarios y cuestionarios existentes
    const users = await prisma.user.findMany({
      where: { role: "WORKER" },
    });

    const questionnaires = await prisma.questionnaire.findMany({
      include: { questions: true },
    });

    if (users.length === 0 || questionnaires.length === 0) {
      logger.warn("No hay usuarios o cuestionarios para crear respuestas");
      return [];
    }

    const createdResponses: Response[] = [];

    // Para cada usuario worker, crear respuestas para cada cuestionario
    for (const user of users) {
      for (const questionnaire of questionnaires) {
        // Generar respuestas aleatorias para cada pregunta
        const answers = questionnaire.questions.map((question) => {
          // Valor aleatorio entre 0 y 4
          const value = Math.floor(Math.random() * 5);
          return {
            questionId: question.id,
            value,
          };
        });

        // Calcular nivel de riesgo basado en la suma de valores
        const totalValue = answers.reduce(
          (sum, answer) => sum + answer.value,
          0
        );
        const maxPossibleValue = questionnaire.questions.length * 4;
        const riskPercentage = (totalValue / maxPossibleValue) * 100;

        let riskLevel: RiskLevel;
        if (riskPercentage < 25) {
          riskLevel = RiskLevel.LOW;
        } else if (riskPercentage < 50) {
          riskLevel = RiskLevel.MEDIUM;
        } else {
          riskLevel = RiskLevel.HIGH;
        }

        // Crear respuesta
        const response = await prisma.response.create({
          data: {
            userId: user.id,
            questionnaireId: questionnaire.id,
            answers,
            riskLevel,
          },
        });

        createdResponses.push(response);
        logger.info(
          `Respuesta creada para usuario ${user.name} al cuestionario "${questionnaire.title}". Nivel de riesgo: ${riskLevel}`
        );
      }
    }

    return createdResponses;
  });
}
