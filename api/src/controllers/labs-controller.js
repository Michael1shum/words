const LabService = require('../services/lab-service');
const ApiError = require('../exceptions/api-error');

class LabsController {
  static async simulateExperiment(req, res, next) {
    try {
      const {
        detectorType,
        voltage,
        efficiency,
        noiseLevel,
        distance,
        mediumAttenuationFactor,
        temperature,
        temperatureSensitivity,
        detectorNoiseLevel,
        failureRate,
        numTrials = 1
      } = req.body;

      const results = [];

      for (let i = 0; i < numTrials; i++) {
        const result = await LabService.runExperiment({
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
        });
        results.push(result);
      }

      res.json(results);
    } catch (e) {
      next(e);
    }
  }

  static async getEvents(req, res, next) {
    try {
      const events = await LabService.getEvents();
      res.json(events);
    } catch (e) {
      next(e);
    }
  }

  static async deleteAllEvents(req, res, next) {
    try {
      await LabService.deleteAllEvents();
      res.status(200).send('Все испытания удалены');
    } catch (e) {
      next(e);
    }
  }
}

module.exports = LabsController;
