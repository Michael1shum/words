const express = require("express");

const axios = require("axios");
const { connectDb } = require("./helpers/db");
const { port, db, apiUrl } = require("./configuration");
const app = express();

const startServer = () => {
  app.listen(port, async () => {
    console.log(`Service auth service started on port: ${port}`);
    console.log(`DataBase ${db}`);
  });
};

app.get("/api/test", (req, res) => {
  res.send("Server is working! Auth service");
});

app.get("/api/currentUser", (req, res) => {
  res.json({
    id: 123,
    email: "test@example.com",
  });
});

app.get("/api/testWithApiData", (req, res) => {
  axios
    .get(`${apiUrl}/testApiData`)
    .then((response) => res.json(response.data));
});

connectDb()
  .on("error", console.log)
  .on("disconnect", connectDb)
  .once("open", startServer);
