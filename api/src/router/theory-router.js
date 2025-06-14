const Router = require('express').Router;
const TheoryController = require('../controllers/theory-controller');
const router = new Router();
const authMiddleware = require('../middlewares/errors');

router.post('/', authMiddleware, TheoryController.create);
router.get('/', TheoryController.getAll);
router.get('/:id', TheoryController.getById);
router.put('/:id', authMiddleware, TheoryController.update);
router.delete('/:id', authMiddleware, TheoryController.delete);
router.get('/category/:category', TheoryController.getByCategory);
router.post('/mark-as-read', authMiddleware, TheoryController.markAsRead);
router.get('/:theoryId/read-status', authMiddleware, TheoryController.getReadStatus);

module.exports = router;
