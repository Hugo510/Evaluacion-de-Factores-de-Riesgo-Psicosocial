// prisma/seed.ts
import { PrismaClient, Role, RiskLevel } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Limpiar datos existentes (en el orden correcto para respetar las relaciones)
  await prisma.response.deleteMany();
  await prisma.question.deleteMany();
  await prisma.questionnaire.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuarios de prueba
  const adminPassword = await bcrypt.hash("admin123", 10);
  const workerPassword = await bcrypt.hash("worker123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: Role.ADMIN,
      department: "Administration",
    },
  });

  const worker1 = await prisma.user.create({
    data: {
      name: "Worker One",
      email: "worker1@example.com",
      password: workerPassword,
      role: Role.WORKER,
      department: "Operations",
    },
  });

  const worker2 = await prisma.user.create({
    data: {
      name: "Worker Two",
      email: "worker2@example.com",
      password: workerPassword,
      role: Role.WORKER,
      department: "Sales",
    },
  });

  // Crear un cuestionario de prueba con preguntas
  const questionnaire = await prisma.questionnaire.create({
    data: {
      title: "Evaluación de Riesgo Psicosocial",
      description:
        "Cuestionario para evaluar factores de riesgo psicosocial en el entorno laboral según la NOM-035.",
      questions: {
        create: [
          {
            text: "¿Cómo evalúas tu carga de trabajo?",
            category: "Carga de trabajo",
          },
          {
            text: "¿Sientes que tienes control sobre tu trabajo?",
            category: "Control sobre el trabajo",
          },
          {
            text: "¿Cómo son tus relaciones laborales?",
            category: "Relaciones laborales",
          },
        ],
      },
    },
    include: {
      questions: true,
    },
  });

  console.log("Cuestionario creado:", questionnaire);

  // Crear una respuesta de ejemplo para worker1
  // Supongamos que los valores de respuesta son: 4, 3 y 2, con un puntaje total = 9 (Riesgo: LOW)
  const sampleAnswers = [
    { questionId: questionnaire.questions[0].id, value: 4 },
    { questionId: questionnaire.questions[1].id, value: 3 },
    { questionId: questionnaire.questions[2].id, value: 2 },
  ];

  const responseRecord = await prisma.response.create({
    data: {
      userId: worker1.id,
      questionnaireId: questionnaire.id,
      answers: sampleAnswers,
      riskLevel: RiskLevel.LOW,
    },
  });

  console.log("Respuesta creada:", responseRecord);
}

main()
  .catch((e) => {
    console.error("Error al seedear la base de datos:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
