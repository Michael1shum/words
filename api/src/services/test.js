const TestModel = require('../models/test-model');
const UserTestResult = require('../models/UserTestResult');
const UserTestResultDTO = require('../dto/UserTestResultDTO');
const mongoose = require('mongoose');
const { usersUrl } = require('../configuration/index');
const uuid = require('uuid');
const TestDTO = require('../dto/test-dto');
const axios = require('axios');
const ApiError = require('../exceptions/api-error');
const { response } = require('express');

class TestService {
  async getAllTests() {
    const tests = await TestModel.find();
    const emptyTests = [];
    for (let test of tests) {
      let testDTO = new TestDTO(test);
      emptyTests.push(testDTO);
    }
    if (emptyTests.length === 0) {
      return 'Список тестов пуст!';
    } else {
      return emptyTests;
    }
  }

  async getTestById(testId) {
    const test = await TestModel.findById(testId);
    if (!test) {
      throw ApiError.NotFound(`Такого теста не существует!`);
    }
    const testDTO = new TestDTO(test);

    if (!testDTO.questions) {
      throw ApiError.NotFound(`У теста нет вопросов!`);
    }
    return testDTO;
  }


  async saveUserTestResult(testId, userId, timeTaken, payload) {
    // Проверка, что payload является массивом
    if (!Array.isArray(payload.answers)) {
      console.error('Ответы не являются массивом:', payload.answers);
      throw new Error("'answers' должны быть массивом.");
    }

    // Обрабатываем ответы
    const processedAnswers = payload.answers.map((answer) => {
      if (!mongoose.Types.ObjectId.isValid(answer.questionId)) {
        console.error(`Некорректный questionId: ${answer.questionId}`);
        throw new Error(`Некорректный questionId: ${answer.questionId}`);
      }
      return {
        questionId: new mongoose.Types.ObjectId(answer.questionId),
        givenAnswer: answer.givenAnswer.map((ans) => String(ans)), // Преобразуем ответы в строки
        isCorrect: false, // Флаг правильности, рассчитывается позже
      };
    });

    // Дальше код сохранения и обработки
    const test = await TestModel.findById(testId);
    if (!test) throw ApiError.NotFound('Тест не найден');

    let score = 0;
    const totalQuestions = test.questions.length;

    const finalAnswers = processedAnswers.map((answer) => {
      const question = test.questions.find(
        (q) => q._id.toString() === answer.questionId.toString()
      );
      const isCorrect =
        question &&
        JSON.stringify(question.answer.sort()) === JSON.stringify(answer.givenAnswer.sort());
      if (isCorrect) score++;

      return { ...answer, isCorrect };
    });

    // Создаём запись о результате теста
    const userTestResult = new UserTestResult({
      userId,
      testId,
      answers: finalAnswers,
      score,
      totalQuestions,
      timeTaken, // Добавляем timeTaken
    });

    await userTestResult.save();
    return new UserTestResultDTO(userTestResult);
  }

  async getUserTestsResults(userId) {
    try {
      const results = await UserTestResult.find({ userId })
        .populate('testId', 'name questions')
        .lean();
        // .sort({ createdAt: -1 });

      if (!results.length) {
        return [];
      }

      const formattedResults = results.map((result) => {
        const test = result.testId;

        const questionsWithAnswers = result.answers.map((userAnswer) => {
          const question = test.questions.find(
            (q) => q._id.toString() === userAnswer.questionId.toString()
          );

          return {
            questionId: userAnswer.questionId,
            questionText: question?.question || 'Вопрос не найден',
            givenAnswer: userAnswer.givenAnswer,
            isCorrect: userAnswer.isCorrect,
          };
        });

        const correctAnswers = result.answers.filter((userAnswer) => userAnswer.isCorrect).length;
        const totalAnswers = result.answers.length;
        const correctPercentage = (correctAnswers / totalAnswers) * 100;

        return {
          answerId: result._id,
          testId: result.testId._id,
          testName: test.name,
          totalQuestions: result.totalQuestions,
          questions: questionsWithAnswers,
          createdAt: result.createdAt,
          timeTaken: result.timeTaken,
          correctPercentage: correctPercentage.toFixed(2),
        };
      });

      return formattedResults;
    } catch (e) {
      console.error('Error in getUserTestsResults:', e);
      throw e; // Пробрасываем ошибку для обработки в контроллере
    }
  }

  async addTest(testData) {
    console.log('testData', testData);
    const newTest = await TestModel.create({ ...testData });
    const testDTO = new TestDTO(newTest); // Преобразуем модель в DTO
    return testDTO;
  }

  async deleteTest(testId) {
    const test = await TestModel.findByIdAndDelete(testId);
    if (!test) {
      throw ApiError.NotFound(`Тест не был найден.`);
    } else {
      return `Тест удалён.`;
    }
  }
}

module.exports = new TestService();
