import {Result} from './result.interface';

export interface Subject {
  id: string;
  assigned: string;
  assignedOn?: number;
  termsAccepted?: boolean;
  termsAcceptedOn?: number;
  results?: Result[];
}
