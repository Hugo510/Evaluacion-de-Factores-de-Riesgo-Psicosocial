// src/schemas/responseSchemas.ts
import { z } from "zod";

export const answerSchema = z.object({
  questionId: z.number().int(),
  value: z
    .number()
    .min(0)
    .max(5, { message: "El valor debe estar entre 0 y 5" }),
});

export type AnswerInput = z.infer<typeof answerSchema>;

export const submitResponseSchema = z.object({
  questionnaireId: z.number().int(),
  answers: z
    .array(answerSchema)
    .min(1, { message: "Debe enviar al menos una respuesta" }),
});

export type SubmitResponseInput = z.infer<typeof submitResponseSchema>;
