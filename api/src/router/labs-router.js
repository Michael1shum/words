const Router = require('express').Router;
const LabsController = require('../controllers/labs-controller');
const router = new Router();

router.post('/simulate', LabsController.simulateExperiment);
router.get('/events', LabsController.getEvents);
router.delete('/events', LabsController.deleteAllEvents);


module.exports = router;
