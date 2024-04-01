const express = require('express');

const cookieParser = require('cookie-parser');
const { connectDb } = require('./helpers/db');
const { port, db } = require('./configuration');
const router = require('./router/index');
const errorsMiddleware = require('./middlewares/errors');
const { authMiddleware, apiProxy } = require('./middlewares/auth');

const PORT = port || 3002;


const app = express();
app.use(express.json());
app.use(cookieParser());
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

connectDb()
  .on('error', console.log)
  .on('disconnect', connectDb)
  .once('open', startServer);
