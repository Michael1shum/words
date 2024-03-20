/** @format */

const express = require("express");

const { getID } = require("./helpers/id");
const bodyParser = require("body-parser");

// const axios = require("axios");
// const { connectDb } = require("./helpers/db");
const { addTest } = require("./helpers/db");
// const { port, db, authApiUrl } = require("./configuration");
// const mongoose = require("mongoose");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// const postSchema = new mongoose.Schema({
//   name: String,
// });
//
// const Post = mongoose.model("Post", postSchema);
const startServer = () => {
  app.listen(3000, async () => {
    console.log(`Service api started on port: ${3000}`);
    // console.log(`DataBase ${db}`);

    // const silence = new Post({ name: "Silence" });
    // await silence.save();

    // const posts = await Post.find();

    // console.log("posts", posts);
  });
};

const testsArray = [ //Массив тестов
  {
    name: "Test3",
    // id: getID(),
    id: "id1",
    questions: [
      {
        // questionID: getID(),
        questionID: "q1",
        question: "Как работает чета там?",
        description: " Выберите несколько вариантов",
        type: "checkbox",
        options: ["ответ 1", "ответ 2", "ответ 3"],
        answer: "ответ 1",
      },
      {
        // questionID: getID(),
        questionID: "q2",
        question: "Как работает чета там?",
        description: " Выберите один вариант",
        type: "radio",
        options: ["ответ 1", "ответ 2", "ответ 3"],
        answer: "ответ 3",
      },
      {
        // questionID: getID(),
        questionID: "q3",
        question: "Как работает чета там?",
        description: "Введите значение",
        type: "input",
        answer: "правда",
      },
    ],
  },
  {
    name: "Test 1",
    id: "id2",
    questions:[
      {questionID: "q1",
        question: "Как работает чета там?",
        description: " Выберите несколько вариантов",
        type: "checkbox",
        options: ["ответ 1", "ответ 2", "ответ 3"],
        answer: "ответ 1",}
    ]
  }
];

// module.exports = testsArray;

let users = [ // Массив пользователей
  {
    userId: "5",
    userName: "Vasya",
    passedTests: [
      { testId: "id1", answers: [] },
      { testId: "id2", answers: [] },
    ],
  },
  {
    userId: "1",
    userName: "Alesha",
    passedTests: [{ testId: "id1", answers: [] }],
  },
];

app.get("/tests", (req, res) => { // вывод всех тестов
  res.json(testsArray);
});

app.get("/tests/:testId", (req, res) => { // выыод теста по id
  const testId = req.params.testId;
  const findTest = testsArray.find((test) => test.id === testId);

  for (let option of findTest.questions) {
    delete option.answer;
  }
  res.json(findTest);
});

app.get("/tests/results/:testId", (req, res) => {   // Вывод определенного теста по id
  const testId = req.params.testId;
  const findUser = users.find((user) => user.userId === req.body.userId);
  const findTest = findUser.passedTests.find((test) => test.testId === testId);

  if (!findUser){
    res.json("Нет такого пользовтеля");
  } else {
    if (!findTest){
      res.json(`Нет такого теста у пользователя ${findUser.userName}`);
    } else {
      res.json(findTest)
    }
  }
});

app.post("/tests/:testId", (req, res) => { // Добавление теста
  req.body.id = req.params.testId;
  testsArray.push(req.body);
  res.send('Тест добавлен.')
});

app.post("/tests/:testId/answer", (req, res) => { // Обработка ответов (сравнение) теста
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
});

// app.get("/testApiData", (req, res) => {
//   res.json({
//     testWithApi: true,
//   });
// });

app.delete("/tests/:testId", (req, res) => {
  const testId = req.params.testId;
  testsArray.forEach((test,index) => {
    if (test.id === testId) {
      res.json(`Тест ${test.name} удалён`);
      testsArray.splice(index,1)
    }
  });
});

startServer();
// connectDb()
//   .on("error", console.log)
//   .on("disconnect", connectDb)
//   .once("open", startServer);
