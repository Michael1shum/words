const TestModel = require('../models/test')

class TestService {
    async getAllTests() {
        const tests = await TestModel.find()
        return tests
    }

    async addTest(test) {
        const newTest = await TestModel.create({...test})
        return newTest
    }
}

module.exports = new TestService()