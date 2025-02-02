const TestModel = require('../models/test-model');
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


  async testResultById(testId, userId) {
    const currentUser = await axios.get(`${usersUrl}/user/${userId}`);
    const requestedTestScore = currentUser.data.testsAnswers[testId];
    if (!requestedTestScore) {
      throw ApiError.NotFound('Данные запрошенного теста не найдены.');
    }
    return requestedTestScore;
  }

  async getComparison(testId, userId, userTestAnswer) {
    // const currentUser = await UserModel.findById(userId);
    const currentTest = await TestModel.findById(testId);
    if (!currentTest) {
      throw ApiError.NotFound(`Такого теста не существует!`);
    } else {
      const questions = currentTest.questions;
      const correctAnswersArray = [];

      for (let answer of userTestAnswer.answers) {
        const answerFromDb = questions.find((item) => item._id.toString() === answer.id)?.answer;
        if (answer.value === answerFromDb) {
          correctAnswersArray.push(answer.id);
        }
      }
      const correctAnswersPercent =
        (correctAnswersArray.length / currentTest.questions.length) * 100;

      currentTest.studentsAnswers[userId] = correctAnswersPercent;
      currentTest.markModified('studentsAnswers');
      await currentTest.save();
      const currentUser = await axios.get(`${usersUrl}/user/${userId}`);

      currentUser.data.testsAnswers = { [testId]: correctAnswersPercent };
      await axios
        .put(`${usersUrl}/user/${userId}`, currentUser.data)
        .then((response) => {
          console.log('Данные пользователя успешно обновлены:', response.data);
        })
        .catch((error) => {
          console.error('Ошибка при обновлении данных пользователя:', error);
        });
      return correctAnswersPercent;
    }
  }

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
