const UserTheoryProgress = require('../models/user-theory-progress-model');

class UserTheoryProgressService {
  static async markAsRead(userId, theoryId) {
    const progress = await UserTheoryProgress.findOneAndUpdate(
      { userId, theoryId },
      { $set: { readAt: new Date() } },
      { upsert: true, new: true }
    );
    return progress;
  }

  static async getReadStatus(userId, theoryId) {
    return await UserTheoryProgress.findOne({ userId, theoryId });
  }
}

module.exports = UserTheoryProgressService;
