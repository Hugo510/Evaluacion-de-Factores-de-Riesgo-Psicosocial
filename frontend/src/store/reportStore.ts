import { create } from "zustand";
import {
  reportService,
  DepartmentReport,
  UserReport,
} from "../services/reportService";

interface ReportState {
  departmentReports: DepartmentReport[] | null;
  userReport: UserReport | null;
  isLoading: boolean;
  error: string | null;
  loadDepartmentReports: () => Promise<void>;
  loadUserReport: (userId: number) => Promise<void>;
  clearError: () => void;
}

export const useReportStore = create<ReportState>((set) => ({
  departmentReports: null,
  userReport: null,
  isLoading: false,
  error: null,

  loadDepartmentReports: async () => {
    try {
      set({ isLoading: true, error: null });
      const data = await reportService.getDepartmentReport();
      set({ departmentReports: data, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Error al cargar reportes por departamento",
        departmentReports: null,
        isLoading: false,
      });
    }
  },

  loadUserReport: async (userId: number) => {
    try {
      set({ isLoading: true, error: null });
      const data = await reportService.getUserReport(userId);
      set({ userReport: data, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Error al cargar reporte del usuario",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
