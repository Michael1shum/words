const Router = require('express').Router;
const TestController = require('../controllers/test-controller');
const router = new Router();


router.get('/tests', TestController.getTests);
router.get('/tests/:testId', TestController.testById);
router.get('/tests/results/:testId', TestController.testResultById);
router.post('/test/add', TestController.addTest);
router.post('/tests/:testId/answer', TestController.testAnswer);
router.delete('/tests/:testId', TestController.testDelete);

module.exports = router;
