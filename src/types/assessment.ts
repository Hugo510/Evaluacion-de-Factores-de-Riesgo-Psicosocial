export interface Question {
  id: number;
  text: string;
  category: string;
  options: string[];
}

export interface Assessment {
  id: string;
  employeeId: string;
  date: Date;
  answers: Record<number, number>;
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  assessments: Assessment[];
}