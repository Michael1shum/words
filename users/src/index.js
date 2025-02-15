const express = require('express'); //Работа приложения.

const cookieParser = require('cookie-parser');
const { connectDb } = require('./helpers/db');
const { port, db } = require('./configuration');
const router = require('./router/index');
const errorsMiddleware = require('./middlewares/errors');

const PORT = port || 3003;
//app.use прорабатывают по очереди.
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(router);
app.use(errorsMiddleware);

const startServer = () => { //Запуск сервера
  app.listen(PORT, async () => {
    console.log(`Service users service started on port: ${PORT}`);
    console.log(`DataBase ${db}`);
  });
};

connectDb().on('error', console.log).on('disconnect', connectDb).once('open', startServer);
