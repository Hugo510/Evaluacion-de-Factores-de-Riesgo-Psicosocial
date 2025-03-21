import api from "../lib/api";

// Interfaces de respuesta para reports
export interface DepartmentReport {
  department: string;
  totalResponses: number;
}

export interface UserReport {
  userId: number;
  pdfBlob: Blob;
  filename: string;
}

export const reportService = {
  getUserReport: async (userId: number): Promise<UserReport> => {
    const response = await api.get(`/reports/user/${userId}`, {
      responseType: "blob",
    });
    
    // Extraer el nombre del archivo de Content-Disposition
    const contentDisposition = response.headers['content-disposition'];
    let filename = `report-${userId}.pdf`;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename=(.*?\.pdf)/i);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/"/g, '');
      }
    }

    return { 
      userId, 
      pdfBlob: response.data, 
      filename 
    };
  },

  getDepartmentReport: async (): Promise<DepartmentReport[]> => {
    const response = await api.get<DepartmentReport[]>("/reports/department");
    return response.data;
  },
};
