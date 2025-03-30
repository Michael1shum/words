const Router = require('express').Router;
const TestController = require('../controllers/test-controller');
const router = new Router();
const labsRouter = require('./labs-router');

router.get('/tests', TestController.getTests);
router.get('/tests/results', TestController.getTestResultsByUser);
router.get('/tests/results/:testId', TestController.testResultById);
router.get('/tests/:testId', TestController.testById);
router.post('/tests/add', TestController.addTest);
router.post('/tests/:testId/answer', TestController.testAnswer);
router.delete('/tests/:testId', TestController.testDelete);

router.use('/labs', labsRouter);

module.exports = router;
