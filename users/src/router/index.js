const Router = require('express').Router;
const PageController = require('../controllers/user-controller');
const router = new Router();


router.get('/list', PageController.getUsers);

module.exports = router;
