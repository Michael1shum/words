export interface Question {
  controlType: 'checkbox' | 'input' | 'radio' | 'select';
  options: string[];
  description: string;
  question: string;
  answer: string[];
}

export interface Test {
  _id: string;
  name: string;
  questions: Question[];
}
