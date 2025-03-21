const TestModel = require('../models/test-model');
const UserTestResult = require('../models/UserTestResult');
const UserTestResultDTO = require("../dto/UserTestResultDTO");
// const UserModel = require('../../../auth/src/models/user-model');
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
    // console.log("Сработало")
    if (emptyTests.length === 0) {
      return 'Список тестов пуст!';
    } else {
      return emptyTests;
    }
  }

  async getTestById(testId) {
    // console.log('testId',testId, typeof(testId))
    const test = await TestModel.findById(testId);
    // console.log("TESTTESTTEST", test)
    if (!test) {
      throw ApiError.NotFound(`Такого теста не существует!`);
    }
    const testDTO = new TestDTO(test);
    // console.log("DTOTEST", test)

    console.log('testDTO', testDTO)
    if (!testDTO.questions) {
      throw ApiError.NotFound(`У теста нет вопросов!`);
    }
    return testDTO;
  }


  async testResultById(testId, userId) {
    const currentUser = await axios.get(`${usersUrl}/user/${userId}`);
    const requestedTestScore = currentUser.data.testsAnswers[testId];
    if (!requestedTestScore) {
      throw ApiError.NotFound('Данные запрошенного теста не найдены.');
    }
    return requestedTestScore;
  }

  async saveUserTestResult(testId, userId, answers) {
    // Логируем answers для проверки
    console.log("Ответы на сервере:", answers);

    // Проверка, что answers является массивом
/*    if (!Array.isArray(answers)) {
      console.error("Ответы не являются массивом:", answers);
      throw new Error("'answers' должны быть массивом.");
    }*/

    const processedAnswers = answers.answers.map((answer) => {
      console.log("Обрабатываем ответ:", answer);

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
    if (!test) throw ApiError.NotFound("Тест не найден");

    let score = 0;
    const totalQuestions = test.questions.length;

    const finalAnswers = processedAnswers.map((answer) => {
      const question = test.questions.find((q) => q._id.toString() === answer.questionId.toString());
      const isCorrect = question && JSON.stringify(question.answer.sort()) === JSON.stringify(answer.givenAnswer.sort());
      if (isCorrect) score++;

      return { ...answer, isCorrect };
    });

    const userTestResult = new UserTestResult({
      userId,
      testId,
      answers: finalAnswers,
      score,
      totalQuestions,
    });

    await userTestResult.save();
    return new UserTestResultDTO(userTestResult);
  }




  /*async saveUserTestResult(testId, userId, answers) {
    const test = await TestModel.findById(testId);
    if (!test) throw ApiError.NotFound("Тест не найден");

    let score = 0;
    const totalQuestions = test.questions.length;



    const processedAnswers = Object.entries(answers).map(([questionId, givenAnswer]) => {
      const question = test.questions.find(q => q._id.toString() === questionId);

      if (!question || !question.answer) {
        return {
          questionId: new mongoose.Types.ObjectId(questionId),
          givenAnswer: givenAnswer.map(ans => String(ans)),
          isCorrect: false
        };
      }

      const isCorrect = JSON.stringify(question.answer.sort()) === JSON.stringify(givenAnswer.sort());
      if (isCorrect) score++;

      return {

        questionId: new mongoose.Types.ObjectId(questionId),
        givenAnswer: givenAnswer.map(ans => String(ans)),
        isCorrect
      };
    });


    const userTestResult = new UserTestResult({

      userId: new mongoose.Types.ObjectId(userId),
      testId: new mongoose.Types.ObjectId(testId),
      answers: processedAnswers,
      score,
      totalQuestions,
    });

    await userTestResult.save();

    return new UserTestResultDTO(userTestResult); // Применяем DTO перед возвратом
  }*/



  async addTest(testData) {
    const newTest = await TestModel.create({ ...testData });
    const testDTO = new TestDTO(newTest);  // Преобразуем модель в DTO
    return testDTO;
  }

  async deleteTest(testId) {
    const test = await TestModel.findByIdAndDelete(testId);
    if (!test) {
      throw ApiError.NotFound(`Тест не был найден.`);
    } else {
      // await axios.patch(`${usersUrl}/user/${userId}`, test)
      //     .then( response => {
      //
      //     })
      return `Тест удалён.`;
    }
  }
}

module.exports = new TestService();
