const Router = require('express').Router
const PageController = require('../controllers/page-controller')
const router = new Router()


router.get('/tests', PageController.getTests)
router.get('/tests/:testId', PageController.testById)
router.get('/tests/results/:testId', PageController.testResultById)
router.post('/test/add', PageController.addTest)
router.post('/tests/:testId/answer', PageController.testAnswer)
router.delete('/tests/:testId', PageController.testDelete)

module.exports = router;
