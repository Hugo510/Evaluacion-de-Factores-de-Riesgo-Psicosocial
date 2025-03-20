/**
 * Datos de usuarios para seeding
 */
import { Role } from "@prisma/client";

export interface UserSeedData {
  name: string;
  email: string;
  password: string; // Sin hash, se aplicará en el script
  role: Role;
  department: string;
}

export const users: UserSeedData[] = [
  {
    name: "Administrador",
    email: "admin@example.com",
    password: "admin123",
    role: Role.ADMIN,
    department: "Dirección",
  },
  {
    name: "Juan Pérez",
    email: "juan@example.com",
    password: "password123",
    role: Role.WORKER,
    department: "Recursos Humanos",
  },
  {
    name: "María Gómez",
    email: "maria@example.com",
    password: "password123",
    role: Role.WORKER,
    department: "Operaciones",
  },
  {
    name: "Carlos Rodríguez",
    email: "carlos@example.com",
    password: "password123",
    role: Role.WORKER,
    department: "Ventas",
  },
  {
    name: "Ana López",
    email: "ana@example.com",
    password: "password123",
    role: Role.WORKER,
    department: "Finanzas",
  },
];
