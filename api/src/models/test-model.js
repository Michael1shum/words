const { Schema, model, Types } = require('mongoose');

const QuestionSchema = new Schema({
  _id: { type: Types.ObjectId, auto: true }, // Mongoose автоматически создаст ID
  controlType: { type: String },
  question: { type: String },
  options: { type: [String] },
  answer: { type: [String] },
  description: String,
});

const TestSchema = new Schema({
  name: { type: String },
  questions: [QuestionSchema],
  studentsAnswers: { type: Object, default: {} },
}, { strict: false });

module.exports = model('Test', TestSchema);
