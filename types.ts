
export enum UserRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

export interface User {
  id: string; // Matricula
  name: string;
  role: UserRole;
  cargo: string;
  local: string;
  elegibilidade: string;
  admissao?: string;
  situacaoAtual?: string;
  dataNasc?: string;
  cpf?: string;
  obs?: string;
  photo?: string;
}

export interface AppState {
  currentUser: User | null;
  allMembers: User[];
  lastUpdate: string;
}
