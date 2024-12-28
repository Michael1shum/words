export interface Question {
  controlType: string;
  question: string;
  options: string[];
  description?: string
  answer?: string;
}

export interface Test {
  id: string;
  name: string;
  questions: Question[]
}
