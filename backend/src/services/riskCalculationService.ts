// src/services/riskCalculationService.ts

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface AnswerInput {
  questionId: number;
  value: number; // Se espera que esté entre 0 y 5
}

export interface RiskCalculationResult {
  totalScore: number;
  riskLevel: RiskLevel;
}

export class RiskCalculationService {
  static calculateRisk(answers: AnswerInput[]): RiskCalculationResult {
    const totalScore = answers.reduce((sum, answer) => sum + answer.value, 0);

    // Ejemplo de umbrales; estos valores se pueden ajustar según la lógica de negocio.
    let riskLevel: RiskLevel;
    if (totalScore < 10) {
      riskLevel = "LOW";
    } else if (totalScore < 20) {
      riskLevel = "MEDIUM";
    } else {
      riskLevel = "HIGH";
    }

    return { totalScore, riskLevel };
  }
}
