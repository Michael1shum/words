const TestModel = require('../models/test')
const mongoose = require('mongoose');
const {users} = require("../configuration");

// const objectId = new mongoose.Types.ObjectId('66143a2da3ab8bffb7de34d6');
// console.log(typeof(objectId),'|||||||||||||||||||||||||||||||||||||||||||||||||||||||');

class TestService {
    async getAllTests() {
        const tests = await TestModel.find();
        return tests
    }

    async getTestById(testId) {
        const test =  await TestModel.findById(testId).lean();
        delete test.__v;
        return test
    }

    async getUserTestById(testId, userId){
        const userAnswer = await TestModel.findOne({user: userId});
        console.log(userAnswer,"111111111111111111111111111111111111111111111111111111")
        const originalTest = await TestModel.findById(testId);
        const testAnswers = [userAnswer, originalTest];
        return testAnswers;

    }

    async getComparison(testId, userId, userTestAnswer){
        const currentTest = await TestModel.findById(testId).lean();
        // console.log("getComparison: currentTest", currentTest, "userTestAnswer", userTestAnswer)
        for (let key in userTestAnswer.questions) {
            console.log(currentTest.questions[key].answer);
            if (userTestAnswer.questions[key].userAnswer === currentTest.questions[key].answer) {
                userTestAnswer.questions[key].answerIsCorrect = true;
            } else {
                userTestAnswer.questions[key].answerIsCorrect = false;
            }
        }
        userTestAnswer.TestId = testId;

        return userTestAnswer;

//         const result = currentTest.questions.reduce((res, cur) => {
//             if (answers[cur.questionID] === cur.answer) {
//                 res[cur.questionID] = true;
//             } else {
//                 res[cur.questionID] = false;
//             }
//             return res;
//         }, {});
// //TODO обратить внимание на то, что меняем константное значение
//
//         users = users.map((user) => {
//             if (user.userId === userId) {
//                 const newPassedTest = user.passedTests.map((item) => {
//                     if (item.testId === testId) {
//                         return { testId, answers: result };
//                     } else {
//                         return item;
//                     }
//                 });
//
//                 return { ...user, passedTests: newPassedTest };
//             } else {
//                 return user;
//             }
//         });
    }

    async addTest(test) {
        const newTest = await TestModel.create({...test})
        return newTest
    }
}

module.exports = new TestService()