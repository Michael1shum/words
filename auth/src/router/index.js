const Router = require('express').Router;
const UserController = require('../controllers/user-controller');
const AuthController = require('../controllers/auth-controller');
const router = new Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth');

router.post('/registration', body('email').isEmail(), body('password').isLength({
  min: 3,
  max: 32,
}), UserController.registration);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/activate/:link', UserController.activate);
router.get('/refresh', UserController.refresh);
router.get('/users', UserController.getUsers);
router.post('/check-auth', AuthController.checkAuth);

module.exports = router;
