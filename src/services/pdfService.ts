// src/services/pdfService.ts

import PDFDocument from "pdfkit";

export interface ReportData {
  userName: string;
  department: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  totalScore: number;
  recommendations: string[];
}

export class PDFService {
  /**
   * Genera un reporte en PDF y retorna un Buffer con el contenido.
   * @param data Objeto con los datos del reporte.
   */
  static async generateReport(data: ReportData): Promise<Buffer> {
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];

    // Capturamos los datos a medida que se generan
    doc.on("data", (chunk: Buffer) => buffers.push(chunk));

    // Finalizamos la generación del documento y esperamos el final
    const endPromise = new Promise<void>((resolve, reject) => {
      doc.on("end", resolve);
      doc.on("error", reject);
    });

    // Contenido del reporte
    doc
      .fontSize(20)
      .text("Reporte de Evaluación de Riesgo Psicosocial", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Nombre: ${data.userName}`);
    doc.text(`Departamento: ${data.department}`);
    doc.text(`Nivel de Riesgo: ${data.riskLevel}`);
    doc.text(`Puntaje Total: ${data.totalScore}`);
    doc.moveDown();
    doc.text("Recomendaciones:");
    data.recommendations.forEach((rec, index) => {
      doc.text(`${index + 1}. ${rec}`);
    });

    // Finalizamos el documento
    doc.end();
    await endPromise;

    return Buffer.concat(buffers);
  }
}
