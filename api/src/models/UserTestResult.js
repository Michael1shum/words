const { Schema, model } = require('mongoose');

const UserTestResultSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Ссылка на пользователя
  testId: { type: Schema.Types.ObjectId, ref: 'Test', required: true }, // Ссылка на тест
  answers: [
    {
      questionId: { type: Schema.Types.ObjectId, required: true }, // ID вопроса
      givenAnswer: { type: [String], required: true }, // Ответ пользователя
      isCorrect: { type: Boolean, required: true } // Правильность ответа
    }
  ],
  score: { type: Number, required: true }, // Количество правильных ответов
  totalQuestions: { type: Number, required: true }, // Всего вопросов в тесте
  createdAt: { type: Date, default: Date.now } // Дата прохождения теста
});

module.exports = model('UserTestResult', UserTestResultSchema);
