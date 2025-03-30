const PhotonEvent = require('../models/photon-model');

class LabService {
  static async runExperiment({
                               detectorType,
                               voltage,
                               efficiency,
                               noiseLevel,
                               distance,
                               mediumAttenuationFactor,
                               temperature,
                               temperatureSensitivity,
                               detectorNoiseLevel,
                               failureRate
                             }) {
    // 1. Расчет эффекта температуры (нормализованный от 0 до 1)
    const optimalTemp = detectorType === 'SNSPD' ? 2 : -50;
    const tempDiff = Math.abs(temperature - optimalTemp);
    const tempEffect = Math.exp(-tempDiff / (temperatureSensitivity * 10)); // Увеличиваем чувствительность

    // 2. Эффект расстояния (используем обратный квадрат, но нормализуем)
    const normDistance = Math.min(distance, 100) / 100; // Нормализуем расстояние до 100 км
    const distanceEffect = 1 / (1 + normDistance * 2); // Мягкое уменьшение с расстоянием

    // 3. Эффект среды (ослабление)
    const mediumEffect = mediumAttenuationFactor; // Уже в диапазоне 0-1

    // 4. Флуктуации эффективности (±10%)
    const efficiencyFluctuation = 0.9 + Math.random() * 0.2;

    // Итоговая вероятность детекции
    const baseProbability = efficiency * tempEffect * distanceEffect * mediumEffect * efficiencyFluctuation;
    const detectionProbability = Math.min(baseProbability, 0.95); // Ограничиваем максимум 95%

    // Логирование для отладки
    console.log('Detection factors:', {
      efficiency,
      tempEffect,
      distanceEffect,
      mediumEffect,
      efficiencyFluctuation,
      finalProbability: detectionProbability
    });

    // Детекция фотона
    const isPhotonDetected = Math.random() < detectionProbability;

    // Шумы
    const isNoise = Math.random() < (noiseLevel + detectorNoiseLevel) / 2;

    // Сбой системы
    const systemFailure = Math.random() < failureRate;
    if (systemFailure) {
      return {
        detected: false,
        noise: true,
        error: "System failure",
        detectorType
      };
    }

    // Сохранение события
    const event = new PhotonEvent({
      timestamp: new Date(),
      detectorType,
      voltage,
      efficiency,
      noise: isNoise && !isPhotonDetected,
      detected: isPhotonDetected,
      temperature,
      distance,
      mediumAttenuationFactor,
      probability: detectionProbability // Сохраняем расчетную вероятность
    });

    await event.save();

    return {
      detected: isPhotonDetected,
      noise: isNoise,
      detectorType,
      probability: detectionProbability
    };
  }

  static async getEvents() {
    return await PhotonEvent.find().sort({ timestamp: -1 });
  }

  static async deleteAllEvents() {
    await PhotonEvent.deleteMany({});
  }
}

module.exports = LabService;
