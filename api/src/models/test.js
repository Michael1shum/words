const {Schema, model} = require('mongoose');

const QuestionSchema = new Schema({
    controlType: {type: String},
    options: {type: [String]},
    answer: {type: String},
    description: String,
})

const TestSchema = new Schema({
    name: {type: String},
    questions: [QuestionSchema],
    studentsAnswers: {type: Object, default: {}}
}, {strict: false});

module.exports = model('Test', TestSchema);