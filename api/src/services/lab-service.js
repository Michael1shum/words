const PhotonEvent = require('../models/photon-model');

class LabService {
  static async runExperiment({ voltage, efficiency, noiseLevel, distance, mediumAttenuationFactor, temperature, temperatureSensitivity, detectorNoiseLevel, failureRate }) {
    // Моделируем влияние среды
    const mediumEffect = mediumAttenuationFactor;  // Коэффициент ослабления среды

    // Моделируем влияние температуры
    const temperatureEffect = 1 - (temperature - 25) / temperatureSensitivity;  // 25°C - оптимальная температура

    // Моделируем колебания эффективности
    const efficiencyFluctuation = 1 + (Math.random() - 0.5) * 0.2;  // Колебания в пределах ±20%

    // Моделируем влияние расстояния (закон обратных квадратов)
    const distanceEffect = Math.pow(1 / distance, 2);  // Уменьшение интенсивности с увеличением расстояния

    // Реальный шанс детекции с учетом всех факторов
    const isPhotonDetected = Math.random() < (efficiency * mediumEffect * temperatureEffect * efficiencyFluctuation * distanceEffect);

    const detectionChance = efficiency * mediumEffect * temperatureEffect * efficiencyFluctuation * distanceEffect;
    console.log('Calculated detection chance:', detectionChance, "voltage", voltage, " efficiency ",efficiency," noiseLevel ",noiseLevel," distance ",distance," mediumAttenuationFactor ",mediumAttenuationFactor," temperature ",temperature," temperatureSensitivity ",temperatureSensitivity," detectorNoiseLevel ",detectorNoiseLevel, " failureRate ",failureRate);


    // Моделируем фоновый шум и шум детектора
    const backgroundNoise = Math.random() < noiseLevel;
    const detectorNoise = Math.random() < detectorNoiseLevel;
    const isNoise = backgroundNoise || detectorNoise;

    // Моделируем вероятность сбоя системы
    const systemFailure = Math.random() < failureRate;
    if (systemFailure) {
      return { detected: false, noise: true, error: "System failure" };  // Если сбой, фотон не детектируется
    }

    const event = new PhotonEvent({
      timestamp: new Date(),
      voltage,
      efficiency,
      noise: isNoise && !isPhotonDetected,  // Шум записывается, если его есть и если фотон не был обнаружен
      detected: isPhotonDetected
    });

    await event.save();
    return { detected: isPhotonDetected, noise: isNoise };
  }

  static async getEvents() {
    return await PhotonEvent.find();
  }

  // Метод для удаления всех событий
  static async deleteAllEvents() {
    await PhotonEvent.deleteMany({});
  }
}


module.exports = LabService;
