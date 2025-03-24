const LabService = require('../services/lab-service');
const ApiError = require('../exceptions/api-error');

class LabsController {
  static async simulateExperiment(req, res, next) {
    try {
      const { voltage, efficiency, noiseLevel, distance, mediumAttenuationFactor, temperature, temperatureSensitivity, detectorNoiseLevel, failureRate } = req.body;

      // Проверка на наличие обязательных параметров
      if (voltage === undefined || efficiency === undefined || noiseLevel === undefined || distance === undefined || mediumAttenuationFactor === undefined || temperature === undefined || temperatureSensitivity === undefined || detectorNoiseLevel === undefined || failureRate === undefined) {
        throw ApiError.BadRequest('Не все данные для эксперимента предоставлены');
      }

      // Запуск эксперимента с новыми параметрами
      const result = await LabService.runExperiment({
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

      // Отправка результата
      res.json(result);
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
  // Метод для удаления всех испытаний
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
