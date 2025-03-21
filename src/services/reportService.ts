// src/services/reportService.ts
import prisma from "../config/db";
import { PDFService } from "./pdfService";

export class ReportService {
  /**
   * Obtiene el reporte del usuario y genera un PDF con los datos del último registro de respuesta.
   * @param userId ID del usuario.
   * @returns Buffer con el contenido del PDF o null si no se encontró respuesta.
   */
  static async getUserReport(userId: number): Promise<Buffer | null> {
    // Consultar el registro más reciente de respuestas del usuario
    const responseRecord = await prisma.response.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { questionnaire: true },
    });

    if (!responseRecord) {
      return null;
    }

    // Consultar información del usuario para el reporte
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Definir recomendaciones básicas según el nivel de riesgo
    const recommendations =
      responseRecord.riskLevel === "HIGH"
        ? ["Buscar apoyo psicológico", "Revisar cargas laborales"]
        : ["Mantener prácticas saludables"];

    // Preparar los datos para generar el reporte
    const reportData = {
      userName: user?.name || "Usuario",
      department: user?.department || "N/A",
      riskLevel: responseRecord.riskLevel,
      totalScore: 0, // Se puede ajustar si se almacena el puntaje total en el modelo
      recommendations,
    };

    // Generar y retornar el PDF utilizando PDFService
    const pdfBuffer = await PDFService.generateReport(reportData);
    return pdfBuffer;
  }

  /**
   * Obtiene reportes agregados por departamento.
   * Este es un ejemplo de consulta agregada; se puede ajustar según las necesidades.
   * @returns Lista de reportes agregados por departamento.
   */
  static async getDepartmentReports(): Promise<any> {
    // Ejemplo de consulta utilizando SQL crudo para obtener totales por departamento
    const reports = await prisma.$queryRaw<
      { department: string; totalResponses: bigint }[]
    >`
      SELECT u.department, COUNT(r.id) as totalResponses
      FROM User u
      JOIN Response r ON u.id = r.userId
      GROUP BY u.department
    `;

    // Convertir BigInt a números para evitar errores de serialización
    return reports.map((report) => ({
      department: report.department,
      totalResponses: Number(report.totalResponses),
    }));
  }
}
