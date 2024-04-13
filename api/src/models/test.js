const { Schema, model } = require('mongoose');

const TestSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    TestId: {type: Schema.Types.ObjectId, ref:'Test'},
    name: { type: String },
    questions: [{
        controlType: { type: String },
        options: { type: [String] },
        answer: { type: String },
        userAnswer: String,
        answerIsCorrect: String,
        description: String,
        questionID: { type: String },
    }],
});

module.exports = model('Test', TestSchema);