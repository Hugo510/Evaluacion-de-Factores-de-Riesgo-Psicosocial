/**
 * Script para sembrar cuestionarios en la base de datos
 */
import { PrismaClient, Questionnaire } from "@prisma/client";
import { questionnaires } from "../data/questionnaires";
import { executeSeedWithTransaction } from "../utils";
import logger from "../../../src/config/logger";

export default async function seedQuestionnaires(
  prisma: PrismaClient
): Promise<Questionnaire[]> {
  return executeSeedWithTransaction(prisma, "questionnaire", async () => {
    // También limpiamos las preguntas ya que tienen relación
    await prisma.question.deleteMany({});

    logger.info(`Creando ${questionnaires.length} cuestionarios...`);

    const createdQuestionnaires: Questionnaire[] = [];

    for (const questionnaireData of questionnaires) {
      // Crear cuestionario con sus preguntas
      const questionnaire = await prisma.questionnaire.create({
        data: {
          title: questionnaireData.title,
          description: questionnaireData.description,
          questions: {
            create: questionnaireData.questions.map((q) => ({
              text: q.text,
              category: q.category,
            })),
          },
        },
        include: {
          questions: true,
        },
      });

      createdQuestionnaires.push(questionnaire);
      logger.info(
        `Cuestionario creado: ${questionnaire.title} con ${questionnaire.questions.length} preguntas`
      );
    }

    return createdQuestionnaires;
  });
}
