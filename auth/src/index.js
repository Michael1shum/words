const express = require('express');

const axios = require('axios');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDb } = require('./helpers/db');
const { port, db, apiUrl } = require('./configuration');
const router = require('./router/index');
const errorsMiddleware = require('./middlewares/errors');
const { authMiddleware, apiProxy } = require('./middlewares/auth');

const PORT = port || 3002;


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(router);
app.use(authMiddleware);
app.use(apiProxy);
app.use(errorsMiddleware);

const startServer = () => {
  app.listen(PORT, async () => {
    console.log(`Service auth service started on port: ${PORT}`);
    console.log(`DataBase ${db}`);
  });
};


// app.get("/test", (req, res) => {
//   res.send("Server is working! Auth services");
// });
//
// app.get("/currentUser", (req, res) => {
//   res.json({
//     id: 123,
//     email: "test@example.com",
//   });
// });
//
// app.get("/testWithApiData", (req, res) => {
//   axios
//     .get(`${apiUrl}/testApiData`)
//     .then((response) => res.json(response.data));
// });

connectDb()
  .on('error', console.log)
  .on('disconnect', connectDb)
  .once('open', startServer);
