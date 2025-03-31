import { AuthResponse } from "../services/authService";

export enum Role {
  ADMIN = "ADMIN",
  WORKER = "WORKER",
}

export enum RiskLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface User {
  id: number;
  email: string;
  role: Role;
  name: string;
  department?: string;
  responses: Response[];
}

export interface Questionnaire {
  id?: number;
  title: string;
  description: string;
  questions: Question[];
}

export interface Question {
  id: number;
  text: string;
  category: string;
  questionnaireId: number;
}

export interface Response {
  id: number;
  userId: number;
  questionnaireId?: number;
  answers: Record<number, number>;
  riskLevel: RiskLevel;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    role?: Role;
    department?: string;
  }) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
  setToken: (token: string | null) => void;
}
