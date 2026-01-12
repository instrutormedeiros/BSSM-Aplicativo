
import { User, UserRole } from './types';

// Removed MOCK_PLANS since HealthPlan is not defined in types.ts

export const MOCK_USERS: User[] = [
  {
    id: 'admin-1',
    name: 'Gestor Hospitalar',
    role: UserRole.ADMIN,
    cargo: 'Administrador',
    local: 'Sede Administrativa',
    elegibilidade: 'Ativo',
    // Removed fields not present in User interface: email, planName, cardNumber, validUntil, cpf, birthDate
  },
  {
    id: 'user-1',
    name: 'João Silva Oliveira',
    role: UserRole.MEMBER,
    cargo: 'Técnico de Enfermagem',
    local: 'Unidade Central',
    elegibilidade: 'Elegível',
    // Removed fields not present in User interface: email, planName, cardNumber, validUntil, cpf, birthDate
  }
];
