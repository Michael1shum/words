const TestService = require('../services/test');
const { users, testsArray } = require('../configuration/index');

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
      const test = req.body;
      console.log('test,', test);
      const newTest = await TestService.addTest(test);
      res.json(newTest);
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

  async testResultById(req, res, next) {
    try {
      const testId = req.params.testId;
      const userId = "6617c09bf1b0905de3ff2e78";
      console.log(userId, "||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||");
      const test = await TestService.getUserTestById(testId, userId);
      res.json(test);
    } catch (e) {
      next(e);
    }
  }



  async testAnswer(req, res, next) {
    try {
      // const { userId, ...answers } = req.body;
      const testId = req.params.testId;
      const userId = "6617c09bf1b0905de3ff2e78";
      const testResult = await TestService.getComparison(testId, userId, req.body);
      await TestService.addTest(testResult);
      res.json(testResult);
    } catch (e) {
      next(e);
    }
  }

  async testDelete(req, res, next) {
    try {
      const testId = req.params.testId;
      testsArray.forEach((test, index) => {
        if (test.id === testId) {
          res.json(`Тест ${test.name} удалён`);
          testsArray.splice(index, 1);
        }
      });
    } catch (e) {
      console.error(e);
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