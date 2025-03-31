// src/services/pdfService.ts

import PDFDocument from "pdfkit";
import { RiskLevel } from "@prisma/client";

export interface ReportData {
  userName: string;
  department: string;
  riskLevel: RiskLevel;
  totalScore: number;
  recommendations: string[];
}

export class PDFService {
  /**
   * Genera un reporte en PDF y retorna un Buffer con el contenido.
   * @param data Objeto con los datos del reporte.
   */
  static async generateReport(data: ReportData): Promise<Buffer> {
    // Se agregan márgenes para un mejor diseño
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Buffer[] = [];

    // Capturamos los datos a medida que se generan
    doc.on("data", (chunk: Buffer) => buffers.push(chunk));

    // Finalizamos la generación del documento y esperamos el final
    const endPromise = new Promise<void>((resolve, reject) => {
      doc.on("end", resolve);
      doc.on("error", reject);
    });

    // Encabezado
    doc
      .fillColor("#444444")
      .fontSize(12)
      .text("Mi Empresa", 50, 30, { align: "left" });
    doc.fontSize(10).text("Reporte Generado:", 0, 40, { align: "right" });
    doc
      .text(new Date().toLocaleDateString("es-ES"), { align: "right" })
      .moveDown();

    // Título centralizado del reporte
    doc
      .moveDown(2)
      .font("Helvetica-Bold")
      .fontSize(22)
      .fillColor("#333333")
      .text("Reporte de Evaluación de Riesgo Psicosocial", { align: "center" })
      .moveDown();

    // Línea separadora
    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, doc.y)
      .lineTo(doc.page.width - 50, doc.y)
      .stroke()
      .moveDown();

    // Datos del reporte
    doc
      .font("Helvetica")
      .fontSize(14)
      .fillColor("#000000")
      .text(`Nombre: ${data.userName}`)
      .moveDown(0.5);
    doc.text(`Departamento: ${data.department}`).moveDown(0.5);
    doc.text(`Nivel de Riesgo: ${data.riskLevel}`).moveDown(0.5);
    doc.text(`Puntaje Total: ${data.totalScore}`).moveDown();

    // Sección de recomendaciones
    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .fillColor("#333333")
      .text("Recomendaciones:", { underline: true })
      .moveDown(0.5);
    doc.font("Helvetica").fontSize(12);
    data.recommendations.forEach((rec, index) => {
      doc.text(`${index + 1}. ${rec}`, { indent: 20 }).moveDown(0.3);
    });

    // Pie de página
    const bottomPos = doc.page.height - 50;
    doc
      .fontSize(10)
      .fillColor("#777777")
      .text(
        "Reporte de Evaluación de Riesgo Psicosocial - Mi Empresa",
        50,
        bottomPos,
        {
          align: "center",
          width: doc.page.width - 100,
        }
      );

    // Finalizamos el documento
    doc.end();
    await endPromise;

    return Buffer.concat(buffers);
  }
}
