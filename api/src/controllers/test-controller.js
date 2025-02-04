const TestService = require('../services/test');
const { users, testsArray } = require('../configuration/index');
const ApiError = require('../exceptions/api-error');

class TestController {
  async getTests(req, res, next) {
    try {
      console.log('Сработал контроллер')
      const tests = await TestService.getAllTests();
      return res.json(tests);
    } catch (e) {
      next(e);
    }
  }

  async addTest(req, res, next) {
    try {
      const { name, questions } = req.body;  // Извлекаем данные из тела запроса
      if (!name || !questions) {
        throw ApiError.BadRequest('Не все данные для теста предоставлены');
      }

      // Создаем новый тест с полученными данными
      const newTest = await TestService.addTest({ name, questions });
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

  async testAnswer(req, res, next) {
    try {
      const testId = req.params.testId;
      const userId = req.headers['x-id'];
      const testResult = await TestService.getComparison(testId, userId, req.body);
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

// const testsArray = [ //Массив тестов
//     {
//         name: "Test3",
//         // id: getID(),
//         id: "id1",
//         questions: [
//             {
//                 // questionID: getID(),
//                 questionID: "q1",
//                 question: "Как работает чета там?",
//                 description: " Выберите несколько вариантов",
//                 type: "checkbox",
//                 options: ["ответ 1", "ответ 2", "ответ 3"],
//                 answer: "ответ 1",
//             },
//             {
//                 // questionID: getID(),
//                 questionID: "q2",
//                 question: "Как работает чета там?",
//                 description: " Выберите один вариант",
//                 type: "radio",
//                 options: ["ответ 1", "ответ 2", "ответ 3"],
//                 answer: "ответ 3",
//             },
//             {
//                 // questionID: getID(),
//                 questionID: "q3",
//                 question: "Как работает чета там?",
//                 description: "Введите значение",
//                 type: "input",
//                 answer: "правда",
//             },
//         ],
//     },
//     {
//         name: "Test 1",
//         id: "id2",
//         questions:[
//             {questionID: "q1",
//                 question: "Как работает чета там?",
//                 description: " Выберите несколько вариантов",
//                 type: "checkbox",
//                 options: ["ответ 1", "ответ 2", "ответ 3"],
//                 answer: "ответ 1",}
//         ]
//     }
// ];
//
//
//
// let users = [ // Массив пользователей
//     {
//         userId: "5",
//         userName: "Vasya",
//         passedTests: [
//             { testId: "id1", answers: [] },
//             { testId: "id2", answers: [] },
//         ],
//     },
//     {
//         userId: "1",
//         userName: "Alesha",
//         passedTests: [{ testId: "id1", answers: [] }],
//     },
// ];

module.exports = new TestController();
