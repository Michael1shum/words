const { Schema, model } = require('mongoose');

const TestSchema = new Schema({
  name: { type: String, required: true },
  questions: [{
    controlType: { type: String, required: true },
    options: { type: [String], required: true },
    answer: { type: String, required: true },
    description: String,
    questionID: { type: String, required: true },
  }],
});

module.exports = model('Test', TestSchema);