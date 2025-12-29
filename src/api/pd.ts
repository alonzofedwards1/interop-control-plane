import { apiRequest } from './client';

export interface PatientMatch {
  id: string;
  name: string;
  birthDate?: string;
}

export const searchPatients = (query: string) =>
  apiRequest<PatientMatch[]>(`/patients?query=${encodeURIComponent(query)}`);
