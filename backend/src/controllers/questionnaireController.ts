import { Request, Response, NextFunction } from "express";
import { QuestionnaireService } from "../services/questionnaireService";
import { CreateQuestionnaireInput } from "../schemas/questionnaireSchemas";

export const getQuestionnaires = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const questionnaires = await QuestionnaireService.getAllQuestionnaires();
    res.status(200).json(questionnaires);
  } catch (error) {
    next(error);
  }
};

export const getQuestionnaireById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const questionnaire = await QuestionnaireService.getQuestionnaireById(id);

    if (!questionnaire) {
      res.status(404).json({ message: "Cuestionario no encontrado" });
      return;
    }

    res.status(200).json(questionnaire);
  } catch (error) {
    next(error);
  }
};

export const createQuestionnaire = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const input: CreateQuestionnaireInput = req.body;
    const newQuestionnaire = await QuestionnaireService.createQuestionnaire(
      input
    );

    res.status(201).json(newQuestionnaire);
  } catch (error) {
    next(error);
  }
};
