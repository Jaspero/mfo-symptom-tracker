export interface Questionnaire {
  id: string;
  name: string;
  createdOn: number;
  description?: string;
  active: boolean;
  fields: any[];
}
