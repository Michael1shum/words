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
    const optimalTemp = detectorType === 'SNSPD' ? 2 : 300;
    const tempDiff = Math.abs(temperature - optimalTemp);

    let tempEffect;
    if (detectorType === 'SNSPD') {
      tempEffect = temperature >= 0.1 && temperature <= 4
        ? Math.exp(-tempDiff / temperatureSensitivity)
        : 0;
    } else {
      tempEffect = temperature >= 200 && temperature <= 400
        ? 1 - (tempDiff / (500 * (1 / temperatureSensitivity)))
        : 0;
    }

    const fiberLoss = mediumAttenuationFactor * distance;
    const transmissionProbability = Math.pow(10, -fiberLoss / 10);

    const isDetectorFailed = Math.random() < failureRate;

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

    // === Новый подход: только одно событие ===
    let isPhotonDetected = false;
    let isNoise = false;

    if (!isDetectorFailed) {
      const noiseThreshold = noiseLevel;
      const photonThreshold = detectionProbability;

      const random = Math.random();

      if (random < noiseThreshold) {
        isNoise = true;
      } else if (random < noiseThreshold + photonThreshold) {
        isPhotonDetected = true;
      }
      // иначе — ни шума, ни фотона
    }

    const event = new PhotonEvent({
      timestamp: new Date(),
      detectorType,
      voltage,
      efficiency,
      noise: isNoise,
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
