import {Injectable} from '@angular/core';
import {DocumentReference} from '@angular/fire/firestore';
import {Research} from '../../../../shared/interfaces/research.interface';
import {Subject} from '../../../../shared/interfaces/subject.interface';

@Injectable({providedIn: 'root'})
export class StateService {
  constructor() { }

  research: Research;
  subject: Subject;
  subjectRef: DocumentReference<Subject>;
  researchRef: DocumentReference<Research>;
}
