const express = require("express");
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
    //
    // const silence = new Post({ name: "Silence" });
    // // await silence.save();
    //
    // const posts = await Post.find();
    //
    // console.log("posts", posts);
  });
};
const testsArray = [{ name: "Test1", id: "id1", q1: "How many cows?", q2: "Choose the right answer."}
  , {name: "Test2", id: "id2", q1: "Choose the right answer.", q2: "how many dogs?"}];
const keyAnswersArray = [{id: "id1", ans1: "1", ans2: "345"}, {id: "id2", ans1: "abd", ans2: "75"}]
const users = [{userId: "5", userName: "Vasya"}]
const usersAnswers = [{userId: "5", id: "id1", ans1: true, ans2: false}]

app.get("/tests", (req, res) => { // вывыод всех тестов
  res.json(testsArray);
});

app.get("/tests/:testId", (req, res) => { // Вывод определенного теста по id
  const id = req.params.testId;
  const result = testsArray.find((item) => item.id === id);
  res.json(result);
  console.log(id);
});

app.get("/tests/results/:resId", (req, res) => { // Вывод ответов теста
  const id = req.params.resId;
  const out = answersArray.find((item) => item.id === id);
  res.json(out);
});

app.post("/tests/:testID/answer", (req, res) => { // Ответ на тест от пользователя и сравнение ответов.
  answersArray = addTest(req.body);
  const id = req.params.testID;
  const answersKeysFromReq = Object.keys(req.body)
  const answerFromServerArray = keyAnswersArray.find(item => item.id === id)

  const resultObj = {}

  answersKeysFromReq.forEach((key) => {
    if(key !== 'id' & key !== 'userId') {
      if (!req.body[key]) {
        resultObj[key]=false
      } else {
        if (req.body[key] === answerFromServerArray[key]) {
          resultObj[key]=true
        } else {
          resultObj[key]=false
        }
      }
    } else {
      resultObj[key] = req.body[key];
    }
  });

 // res.send(resultObj);
  console.log(resultObj)


 usersAnswers.forEach((user) => {
   if (user.userId !== resultObj.userId) {
     usersAnswers.push(resultObj);
   } else {
     if (user.id === resultObj.id) {
       for (item in user) {
         user[item] = resultObj[item];
       }

     }
   }
  });

 //console.log(resultObj);
  res.send(usersAnswers);
});

app.get("/test2", (req, res) => {
  const vanya = testsArray.find((item) => item.name === req?.query?.testName);
  console.log(vanya);
  res.json(vanya);
});

// "test/1/response"[{ id1: 2, q2: [1, 2, 3], q3: "sd;lfkhsd" }];

app.post("/testPost", (req, res) => {
  addTest(req.body);
  res.send("post!");
});

// app.get("/testwithCurrentUser", (req, res) => {
//   axios.get(`${authApiUrl}/currentUser`).then((response) => {
//     res.json({ testWithCurrentUser: true, currentUserFromAuth: response.data });
//   });
// });

app.get("/testApiData", (req, res) => {
  res.json({
    testWithApi: true,
    status: "good",
  });
});

// connectDb()
//   .on("error", console.log)
//   .on("disconnect", connectDb)
//   .once("open", startServer);

startServer();
