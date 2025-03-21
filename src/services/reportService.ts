import api from "../lib/api";

// Interfaces de respuesta para reports
export interface DepartmentReport {
  department: string;
  totalResponses: number;
}

export interface UserReport {
  userId: number;
  // Supongamos que se retorna un PDF en formato blob o una URL para descargarlo
  pdfUrl: string;
}

export const reportService = {
  getUserReport: async (userId: number): Promise<UserReport> => {
    const response = await api.get(`/reports/user/${userId}`, {
      responseType: "blob",
    });
    // Crea una URL local para el blob recibido
    const pdfUrl = URL.createObjectURL(response.data);
    return { userId, pdfUrl };
  },

  getDepartmentReport: async (): Promise<DepartmentReport[]> => {
    const response = await api.get<DepartmentReport[]>("/reports/department");
    return response.data;
  },
};
