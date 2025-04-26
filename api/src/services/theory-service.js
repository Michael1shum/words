const Theory = require('../models/theory-model');

class TheoryService {
  static async createTheory(data) {
    const theory = new Theory(data);
    return await theory.save();
  }

  static async getAllTheory() {
    return await Theory.find().sort({ createdAt: -1 });
  }

  static async getTheoryById(id) {
    return await Theory.findById(id);
  }

  static async updateTheory(id, data) {
    data.updatedAt = new Date();
    return await Theory.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteTheory(id) {
    return await Theory.findByIdAndDelete(id);
  }

  static async getByCategory(category) {
    return await Theory.find({ category }).sort({ createdAt: -1 });
  }
}

module.exports = TheoryService;
