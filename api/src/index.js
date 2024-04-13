/** @format */

const express = require('express');

const bodyParser = require('body-parser');
const {connectDb} = require('./helpers/db');
const {port, db} = require('./configuration');
const router = require('./router/index');
const cookieParser = require('cookie-parser');
const errorsMiddleware = require('./middlewares/errors');


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.json());
app.use(cookieParser());
app.use(router);
app.use(errorsMiddleware);

const PORT = port || 3001;

const startServer = async () => {
    try {
        app.listen(PORT, async () => {
            console.log(`Service api started on port:  ${PORT}`);
            console.log(`DataBase ${db}`);
        });
    } catch (e) {
        console.error(e);
    }

};

connectDb()
    .on('error', console.log)
    .on('disconnect', connectDb)
    .once('open', startServer);
