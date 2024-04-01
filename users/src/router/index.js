const Router = require('express').Router;
const UserController = require('../controllers/user-controller');
const router = new Router();


router.get('/list', UserController.getUsers);

module.exports = router;
