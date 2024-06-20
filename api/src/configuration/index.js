module.exports.port = process.env.PORT;
module.exports.db = process.env.MONGO_URL;
module.exports.authApiUrl = process.env.AUTH_API_URL;
module.exports.usersUrl = process.env.USERS_URL;
const testsArray = [
  //Массив тестов
  {
    name: 'Test3',
    // id: getID(),
    id: 'id1',
    questions: [
      {
        // questionID: getID(),
        questionID: 'q1',
        question: 'Как работает чета там?',
        description: ' Выберите несколько вариантов',
        type: 'checkbox',
        options: ['ответ 1', 'ответ 2', 'ответ 3'],
        answer: 'ответ 1',
      },
      {
        // questionID: getID(),
        questionID: 'q2',
        question: 'Как работает чета там?',
        description: ' Выберите один вариант',
        type: 'radio',
        options: ['ответ 1', 'ответ 2', 'ответ 3'],
        answer: 'ответ 3',
      },
      {
        // questionID: getID(),
        questionID: 'q3',
        question: 'Как работает чета там?',
        description: 'Введите значение',
        type: 'input',
        answer: 'правда',
      },
    ],
  },
  {
    name: 'Test 1',
    id: 'id2',
    questions: [
      {
        questionID: 'q1',
        question: 'Как работает чета там?',
        description: ' Выберите несколько вариантов',
        type: 'checkbox',
        options: ['ответ 1', 'ответ 2', 'ответ 3'],
        answer: 'ответ 1',
      },
    ],
  },
];

let users = [
  // Массив пользователей
  {
    userId: '5',
    userName: 'Vasya',
    passedTests: [
      { testId: 'id1', answers: [] },
      { testId: 'id2', answers: [] },
    ],
  },
  {
    userId: '1',
    userName: 'Alesha',
    passedTests: [{ testId: 'id1', answers: [] }],
  },
];

module.exports.testsArray = testsArray;
module.exports.users = users;

module.exports.test = ['123'];
module.exports.test2 = ['55555'];
