import { Request, Response, NextFunction } from "express";
import { ReportService } from "../services/reportService";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import logger from "../config/logger";

export const getUserReport = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);
    const requestingUserId = req.user?.id;

    // Verificar si el usuario autenticado puede acceder a este reporte
    if (!requestingUserId) {
      res.status(401).json({ message: "Usuario no autenticado" });
      return;
    }

    // Verificar si existe un reporte para este usuario
    const report = await ReportService.getUserReport(userId);

    if (!report) {
      res.status(404).json({ message: "Reporte no encontrado" });
      return;
    }

    // Enviar el reporte en formato PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=report-${userId}.pdf`
    );
    res.send(report);
  } catch (error) {
    logger.error("Error al generar reporte de usuario", { error });
    next(error);
  }
};

export const getDepartmentReport = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userRole = req.user?.role;

    // Verificar si el usuario tiene permisos para ver reportes de departamento
    if (!userRole || userRole !== "ADMIN") {
      res.status(403).json({ message: "Acceso denegado" });
      return;
    }

    // Obtener reportes por departamento
    const departmentReports = await ReportService.getDepartmentReports();

    res.status(200).json(departmentReports);
  } catch (error) {
    logger.error("Error al generar reporte por departamento", { error });
    next(error);
  }
};
