const TheoryService = require('../services/theory-service');
const ApiError = require('../exceptions/api-error');
const UserTheoryProgressService = require('../services/user-theory-progress-service');

class TheoryController {
  static async create(req, res, next) {
    try {
      const { title, content, category, isHtml = false } = req.body;
      if (!title || !content || !category) {
        throw ApiError.BadRequest('Не все обязательные поля заполнены');
      }

      const theory = await TheoryService.createTheory({
        title,
        content: isHtml ? content : content.replace(/\n/g, '<br>'),
        category,
        isHtml
      });
      res.json(theory);
    } catch (e) {
      next(e);
    }
  }

  static async getAll(req, res, next) {
    try {
      const theories = await TheoryService.getAllTheory();
      res.json(theories);
    } catch (e) {
      next(e);
    }
  }

  static async getById(req, res, next) {
    try {
      const theory = await TheoryService.getTheoryById(req.params.id);
      if (!theory) {
        throw ApiError.NotFound('Теоретический материал не найден');
      }
      res.json(theory);
    } catch (e) {
      next(e);
    }
  }

  static async update(req, res, next) {
    try {
      const theory = await TheoryService.updateTheory(req.params.id, req.body);
      if (!theory) {
        throw ApiError.NotFound('Теоретический материал не найден');
      }
      res.json(theory);
    } catch (e) {
      next(e);
    }
  }

  static async delete(req, res, next) {
    try {
      const theory = await TheoryService.deleteTheory(req.params.id);
      if (!theory) {
        throw ApiError.NotFound('Теоретический материал не найден');
      }
      res.json({message: 'Материал успешно удален'});
    } catch (e) {
      next(e);
    }
  }

  static async getByCategory(req, res, next) {
    try {
      const theories = await TheoryService.getByCategory(req.params.category);
      res.json(theories);
    } catch (e) {
      next(e);
    }
  }


  static async markAsRead(req, res, next) {
    try {
      const {theoryId} = req.body;
      const userId = req.user.id;

      if (!theoryId) {
        throw ApiError.BadRequest('Не указан ID теории');
      }

      await UserTheoryProgressService.markAsRead(userId, theoryId);
      res.json({success: true, message: 'Теория отмечена как прочитанная'});
    } catch (e) {
      next(e);
    }
  }

  static async getReadStatus(req, res, next) {
    try {
      console.log('Getting read status for:', req.params.theoryId, 'user:', req.user.id);
      const { theoryId } = req.params;
      const userId = req.user.id;

      if (!theoryId || !mongoose.Types.ObjectId.isValid(theoryId)) {
        throw ApiError.BadRequest('Некорректный ID теории');
      }

      const progress = await UserTheoryProgressService.getReadStatus(userId, theoryId);
      console.log('Read status result:', progress);
      res.json({ isRead: !!progress });
    } catch (e) {
      console.error('Error in getReadStatus:', e);
      next(e);
    }
  }
}
module.exports = TheoryController;
