const { Schema, model } = require('mongoose');

const UserTestResultSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  testId: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
  answers: [
    {
      questionId: { type: Schema.Types.ObjectId, required: true },
      givenAnswer: { type: [String], required: true },
      isCorrect: { type: Boolean, required: true }
    }
  ],
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  timeTaken: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = model('UserTestResult', UserTestResultSchema);
