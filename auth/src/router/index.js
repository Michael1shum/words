const Router = require('express').Router;
const AuthController = require('../controllers/auth-controller');
const router = new Router();
const { body } = require('express-validator');

router.post('/registration', body('email').isEmail(), body('password').isLength({
  min: 3,
  max: 32,
}), AuthController.registration);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/activate/:link', AuthController.activate);
router.get('/refresh', AuthController.refresh);
router.post('/check-auth', AuthController.checkAuth);

module.exports = router;
