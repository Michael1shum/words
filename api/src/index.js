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
const testsArray = [{ name: "Vanya", id: "id1" }];
app.get("/test2", (req, res) => {
  const vanya = array.find((item) => item.name === req?.query?.studentName);
  console.log(vanya);
  res.json(vanya);
});

"test/1/response"[{ id1: 2, q2: [1, 2, 3], q3: "sd;lfkhsd" }];

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
