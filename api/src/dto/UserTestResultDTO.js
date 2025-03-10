module.exports = class UserTestResultDTO {
  userId;
  testId;
  answers;
  score;
  totalQuestions;
  createdAt;

  constructor(model) {
    this.userId = model.userId.toString();
    this.testId = model.testId.toString();
    this.answers = model.answers.map((answer) => ({
      questionId: answer.questionId.toString(),
      givenAnswer: answer.givenAnswer.map((ans) => String(ans)), // Приводим к строкам
      isCorrect: answer.isCorrect,
    }));
    this.score = model.score;
    this.totalQuestions = model.totalQuestions;
    this.createdAt = model.createdAt;
  }
};
