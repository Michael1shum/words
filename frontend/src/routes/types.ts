export interface Question {
  _id: string;
  controlType: 'checkbox' | 'input' | 'radio' | 'select';
  options: string[];
  description: string;
  question: string;
  answer: string[];
}


export interface Test {
  timeLimit: number;
  _id: string;
  description: string;
  name: string;
  questions: Question[];
}



export interface UserTestAnswers {
  // userId: string;
  answers: {
    questionId: string;
    givenAnswer: string[];
  }[];
}

export interface TheoryData {
  _id: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  description: string;
}

export interface PhotonEvent {
  _id: string;
  timestamp: string;
  detectorType: DetectorType;
  voltage: number;
  efficiency: number;
  noise: boolean;
  detected: boolean;
  temperature: number;
  distance: number;
  mediumAttenuationFactor: number;
  probability: number;
}

export interface ExperimentParams {
  detectorType: DetectorType;
  temperature: number;
  distance: number;
  mediumAttenuationFactor: number;
  voltage: number;
  efficiency: number;
  noiseLevel: number;
  temperatureSensitivity: number;
  detectorNoiseLevel: number;
  failureRate: number;
}

export interface ExperimentResult {
  detected: boolean;
  noise: boolean;
  detectorType: DetectorType;
  probability: number;
  error?: string;
}


export type DetectorType = 'SNSPD' | 'SPAD';

export interface DetectorPreset {
  voltage: number;
  efficiency: number;
  noiseLevel: number;
  temperatureRange: [number, number];
  optimalTemperature: number;
  distanceRange: [number, number];
  mediumAttenuationFactor: number;
  temperatureSensitivity: number;
  detectorNoiseLevel: number;
  failureRate: number;
  description: string;
}


export const DETECTOR_PRESETS: Record<DetectorType, DetectorPreset> = {
  SNSPD: {
    voltage: 5,              // Напряжение смещения (В) - обычно низкое для сверхпроводников
    efficiency: 0.95,        // Максимальная квантовая эффективность (95%)
    noiseLevel: 0.001,       // Вероятность ложных срабатываний (0.1%)
    temperatureRange: [0.1, 4],  // Рабочий температурный диапазон (Кельвины)
    optimalTemperature: 2,   // Оптимальная температура работы (Кельвины)
    distanceRange: [0, 100], // Эффективный диапазон расстояний (км)
    mediumAttenuationFactor: 0.2, // Коэффициент ослабления среды (0.9 = 10% потерь)
    temperatureSensitivity: 0.5, // Чувствительность к изменению температуры
    detectorNoiseLevel: 0.001,   // Уровень собственных шумов детектора
    failureRate: 0.001,      // Вероятность аппаратного сбоя
    description: 'Сверхпроводящий нанопроволочный детектор. Работает при 0.1-4K. Оптимальная эффективность 95% при 2K. Использует волокно с затуханием 0.2 дБ/км (1550 нм).'
  },
  SPAD: {
    voltage: 30,             // Высокое напряжение для лавинного пробоя (В)
    efficiency: 0.2,         // Квантовая эффективность (30%)
    noiseLevel: 0.1,         // Вероятность ложных срабатываний (10%)
    temperatureRange: [200, 400], // Рабочий диапазон (K)
    optimalTemperature: 300, // Оптимальная температура (K)
    distanceRange: [0, 100], // Эффективный диапазон расстояний (км)
    mediumAttenuationFactor: 0.35, // Коэффициент ослабления среды
    temperatureSensitivity: 50,   // Менее чувствителен к температуре
    detectorNoiseLevel: 0.1, // Более высокий уровень шумов
    failureRate: 0.01,       // Более высокая вероятность сбоев
    description: 'Лавинный фотодиод. Работает при умеренном охлаждении (-80°C до +25°C). Умеренная эффективность (до 30%) и более высокий уровень шума по сравнению с SNSPD.'
  }
};

