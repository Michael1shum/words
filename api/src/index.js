/** @format */

const express = require("express");


const { getID } = require("./helpers/id");
const bodyParser = require("body-parser");

// const axios = require("axios");
const { connectDb } = require("./helpers/db");
// const { addTest } = require("./helpers/db");
const { port, db } = require("./configuration");
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const PORT = port || 3000
// const postSchema = new mongoose.Schema({
//   name: String,
// });
//
// const Post = mongoose.model("Post", postSchema);
const startServer = async () => {
  try{
    app.listen(PORT, async () => {
      console.log(`Service api started on port:  ${PORT}`);
      // console.log(`DataBase ${db}`);

      // const silence = new Post({ name: "Silence" });
      // await silence.save();

      // const posts = await Post.find();

      // console.log("posts", posts);
    });
  } catch (e) {
    console.error(e)
  }

};

const testsArray = [
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
];

let users = [
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

app.get("/tests", (req, res) => {
  // вывыод всех тестов
  res.json(testsArray);
});

app.get("/tests/:testId", (req, res) => {
  // Вывод определенного теста по id
  const id = req.params.testId;
  const result = testsArray.find((item) => item.id === id);
  res.json(result);
  console.log(id);
});

app.get("/tests/results/:resId", (req, res) => {
  // Вывод ответов теста
  const id = req.params.resId;
  const out = answersArray.find((item) => item.id === id);
  res.json(out);
});

app.post("/tests/:testID/answer", (req, res) => {
  console.log(req.body);
  const { userId, ...answers } = req.body;
  const testId = req.params.testID;
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

app.get("/testApiData", (req, res) => {
  res.json({
    testWithApi: true,
  });
});

connectDb()
  .on("error", console.log)
  .on("disconnect", connectDb)
  .once("open", startServer);
