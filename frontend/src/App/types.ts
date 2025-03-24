export interface WordsFields {
  word: string;
  translation: string;
}

export interface PhotonEvent {
  _id: string;
  timestamp: string;
  voltage: number;
  efficiency: number;
  noise: boolean;
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
