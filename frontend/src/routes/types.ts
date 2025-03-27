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

export interface PhotonEvent {
  _id: string;
  timestamp: string;
  voltage: number;
  efficiency: number;
  noise: boolean;
  detected: boolean; // Добавь это свойство
}

export interface ExperimentParams {
  voltage: number;
  efficiency: number;
  noiseLevel: number;
  distance: number;  // Новое поле для расстояния
  mediumAttenuationFactor: number;  // Коэффициент ослабления среды
  temperature: number;  // Температура
  temperatureSensitivity: number;  // Чувствительность к температуре
  detectorNoiseLevel: number;  // Уровень шума детектора
  failureRate: number;  // Вероятность сбоя системы
}
