const Router = require('express').Router;
const UserController = require('../controllers/user-controller');
const router = new Router();

router.get('/list', UserController.getUsers);
router.get('/user/:id', UserController.getUserById);
router.put('/user/:id', UserController.postUserDataById);

module.exports = router;
