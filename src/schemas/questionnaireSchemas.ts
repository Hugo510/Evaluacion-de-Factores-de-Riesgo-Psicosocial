// src/schemas/questionnaireSchemas.ts
import { z } from "zod";

export const questionSchema = z.object({
  text: z
    .string()
    .min(1, { message: "El texto de la pregunta es obligatorio" }),
  category: z.string().min(1, { message: "La categoría es obligatoria" }),
});

export type QuestionInput = z.infer<typeof questionSchema>;

export const createQuestionnaireSchema = z.object({
  title: z.string().min(1, { message: "El título es obligatorio" }),
  description: z.string().optional(),
  questions: z
    .array(questionSchema)
    .min(1, { message: "Debe haber al menos una pregunta" }),
});

export type CreateQuestionnaireInput = z.infer<
  typeof createQuestionnaireSchema
>;
