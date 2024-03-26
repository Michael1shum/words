// import {testsArray, users} from "../index";
// let {users} = require('../index');
// const testsArray = require('../index');
// let users = require('../index');
const TestService = require('../services/test');
const { test, test2, users, testsArray } = require('../configuration/index');

// const {testsArray, users} = require('../index')


class PageController {
  async getTests(req, res, next) {
    try {
      const tests = await TestService.getAllTests();
      return res.json(tests);
    } catch (e) {
      next(e);
    }
  }

  async testById(req, res, next) {
    try {
      const testId = req.params.testId;
      const findTest = testsArray.find((test) => test.id === testId);

      for (let option of findTest.questions) {
        delete option.answer;
      }
      res.json(findTest);
    } catch (e) {
      console.error(e);
    }
  }

  async testResultById(req, res, next) {
    try {
      const testId = req.params.testId;
      const findUser = users.find((user) => user.userId === req.body.userId);
      const findTest = findUser.passedTests.find((test) => test.testId === testId);

      if (!findUser) {
        res.json('Нет такого пользовтеля');
      } else {
        if (!findTest) {
          res.json(`Нет такого теста у пользователя ${findUser.userName}`);
        } else {
          res.json(findTest);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  async addTest(req, res, next) {
    try {
      const test = req.body;
      const newTest = await TestService.addTest(test);
      res.json(newTest);
    } catch (e) {
      next(e);
    }
  }

  async testAnswer(req, res, next) {
    try {
      console.log(req.body);
      const { userId, ...answers } = req.body;
      const testId = req.params.testId;
      const currentTest = testsArray.find((item) => item.id === testId);

      const result = currentTest.questions.reduce((res, cur) => {
        if (answers[cur.questionID] === cur.answer) {
          res[cur.questionID] = true;
        } else {
          res[cur.questionID] = false;
        }
        return res;
      }, {});
//TODO обратить внимание на то, что меняем константное значение
      users = users.map((user) => {
        if (user.userId === userId) {
          const newPassedTest = user.passedTests.map((item) => {
            if (item.testId === testId) {
              return { testId, answers: result };
            } else {
              return item;
            }
          });

          return { ...user, passedTests: newPassedTest };
        } else {
          return user;
        }
      });

      res.send(result);
    } catch (e) {
      console.error(e);
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

module.exports = new PageController();