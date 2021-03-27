import {DocumentReference} from '@angular/fire/firestore';

export interface Symptom {
  id: string;
  subject: string;
  type: string;
  createdOn: number;
  endedOn: number;
  intensity: number;
  description?: string;
  ref?: DocumentReference<Symptom>;
}
