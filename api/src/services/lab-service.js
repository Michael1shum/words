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

    // 1. Температурные эффекты
    const optimalTemp = detectorType === 'SNSPD' ? 2 : 300;
    const tempDiff = Math.abs(temperature - optimalTemp);
    let tempEffect;

    if (detectorType === 'SNSPD') {
      tempEffect = temperature >= 0.1 && temperature <= 4
        ? Math.exp(-tempDiff / temperatureSensitivity)
        : 0;
    } else { // SPAD
      tempEffect = temperature >= 200 && temperature <= 400
        ? 1 - (tempDiff / (500 * (1 / temperatureSensitivity)))
        : 0;
    }

    // 2. Затухание в волокне
    const fiberLoss = mediumAttenuationFactor * distance;
    const transmissionProbability = Math.pow(10, -fiberLoss / 10);

    // 3. Учитываем вероятность отказа детектора
    const isDetectorFailed = Math.random() < failureRate;

    // 4. Итоговая вероятность
    let detectionProbability = 0;

    if (!isDetectorFailed) {
      const voltageEffect = detectorType === 'SNSPD'
        ? Math.min(voltage / 5, 1)
        : Math.min(voltage / 30, 1);

      const efficiencyFluctuation = 0.9 + Math.random() * 0.2;

      detectionProbability = Math.min(
        efficiency * tempEffect * transmissionProbability * efficiencyFluctuation * voltageEffect,
        0.95
      );
    }

    // Детекция фотона и шумов
    const isPhotonDetected = !isDetectorFailed && (Math.random() < detectionProbability);
    const isNoise = !isDetectorFailed && (Math.random() < (noiseLevel + detectorNoiseLevel) / 2);

    // Сохранение результатов
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
      probability: detectionProbability,
      temperatureSensitivity,
      detectorNoiseLevel,
      failureRate
    });

    await event.save();
    console.log("detectorType ", detectorType,
      "voltage ",voltage,
      "efficiency ",efficiency,
      "noiseLevel ",noiseLevel,
      "distance ",distance,
      "mediumAttenuationFactor ",mediumAttenuationFactor,
      "temperature ",temperature,
      "temperatureSensitivity ",temperatureSensitivity,
      "detectorNoiseLevel ",detectorNoiseLevel,
      "failureRate ", failureRate);
    return {
      detected: isPhotonDetected,
      noise: isNoise,
      detectorType,
      probability: detectionProbability,
      isDetectorFailed
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
