export interface Question {
  _id: string;
  controlType: 'checkbox' | 'input' | 'radio' | 'select';
  options: string[];
  description: string;
  question: string;
  answer: string[];
}


export interface Test {
  timeLimit: number; // Add timeLimit field here
  _id: string;
  description: string;
  name: string;
  questions: Question[];
}



export interface UserTestAnswers {
  userId: string;
  answers: {
    questionId: string;
    givenAnswer: string[];
  }[];
}
