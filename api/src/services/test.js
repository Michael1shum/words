const TestModel = require('../models/test')
const mongoose = require('mongoose');
const {users} = require("../configuration");
const uuid = require('uuid')

// const objectId = new mongoose.Types.ObjectId('66143a2da3ab8bffb7de34d6');
// console.log(typeof(objectId),'|||||||||||||||||||||||||||||||||||||||||||||||||||||||');

class TestService {
    async getAllTests() {
        const tests = await TestModel.find();
        return tests
    }

    async getTestById(testId) {
        const test = await TestModel.findById(testId).lean();
        delete test.__v;
        return test
    }

    async getUserTestById(testId, userId) {
        const userAnswer = await TestModel.findOne({user: userId});
        console.log(userAnswer, "111111111111111111111111111111111111111111111111111111")
        const originalTest = await TestModel.findById(testId);
        const testAnswers = [userAnswer, originalTest];

        return testAnswers;
    }

    async getComparison(testId, userId, userTestAnswer) {
        const currentTest = await TestModel.findById(testId);
        const questions = currentTest.questions
        const correctAnswersArray = []

        for (let answer of userTestAnswer.answers) {
            const answerFromDb = questions.find(item => item._id.toString() === answer.id)?.answer
            if (answer.value === answerFromDb) {
                correctAnswersArray.push(answer.id)
            }
        }
        const correctAnswersPercent = correctAnswersArray.length / currentTest.questions.length * 100;

        currentTest.studentsAnswers[userId] = correctAnswersPercent
        currentTest.markModified('studentsAnswers');
        await currentTest.save()

        return correctAnswersPercent;
    }

    async addTest(testData) {
        const newTest = await TestModel.create({...testData})
        return newTest
    }
}

module.exports = new TestService()