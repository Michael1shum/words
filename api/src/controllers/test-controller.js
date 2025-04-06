const TestService = require('../services/test');
const { users, testsArray } = require('../configuration/index');
const ApiError = require('../exceptions/api-error');

class TestController {
  async getTests(req, res, next) {
    try {
      console.log('Сработал контроллер');
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
  /*  async addTest(req, res, next) {
    try {
      const testData = req.body;
      const newTest = await TestService.addTest(testData);
      res.json(newTest);
    } catch (e) {
      next(e);
    }
  }*/

  async testById(req, res, next) {
    try {
      const testId = req.params.testId;
      const test = await TestService.getTestById(testId);
      res.json(test);
    } catch (e) {
      next(e);
    }
  }

  async testResultById(req, res, next) {
    try {
      const testId = req.params.testId;
      const userId = req.headers['x-id'];
      const testScore = await TestService.testResultById(testId, userId);
      res.json(testScore);
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

      console.log("req.body", req.body)

      // console.log("testAnswer: ",testId,' userId', typeof(userId))
      const testResult = await TestService.saveUserTestResult(testId, userId, timeTaken, payload);
      res.json(testResult);
    } catch (e) {
      next(e);
    }
  }

  async getUserAnswers(req, res, next) {
    try {
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
