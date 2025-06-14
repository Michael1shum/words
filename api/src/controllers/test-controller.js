const TestService = require('../services/test');
const { users, testsArray } = require('../configuration/index');
const ApiError = require('../exceptions/api-error');

class TestController {
  async getTests(req, res, next) {
    try {
      const tests = await TestService.getAllTests();
      return res.json(tests);
    } catch (e) {
      next(e);
    }
  }

  async addTest(req, res, next) {
    try {
      const { name, questions, timeLimit } = req.body; // Извлекаем данные из тела запроса
      if (!name || !questions) {
        throw ApiError.BadRequest('Не все данные для теста предоставлены');
      }

      // Создаем новый тест с полученными данными
      const newTest = await TestService.addTest({ name, questions, timeLimit });
      res.status(201).json(newTest);
    } catch (e) {
      next(e);
    }
  }

  async testById(req, res, next) {
    try {
      const testId = req.params.testId;
      const test = await TestService.getTestById(testId);
      res.json(test);
    } catch (e) {
      next(e);
    }
  }


  async getTestResultsByUser(req, res, next) {
    try {
      const userId = req.headers['x-id'];
      const testResults = await TestService.getUserTestsResults(userId);
      res.json(testResults);
    } catch (e) {
      next(e);
    }
  }

  async testAnswer(req, res, next) {
    try {
      const testId = req.params.testId;
      const userId = req.headers['x-id'];
      const { timeTaken, payload } = req.body;
      const testResult = await TestService.saveUserTestResult(testId, userId, timeTaken, payload);
      res.json(testResult);
    } catch (e) {
      next(e);
    }
  }

  async testDelete(req, res, next) {
    try {
      const testId = req.params.testId;
      const result = await TestService.deleteTest(testId);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new TestController();
