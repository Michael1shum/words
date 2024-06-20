const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  role: { type: String, required: true, default: 'user' },
  activationLink: { type: String },
  testsAnswers: { type: Object, default: {} },
});

module.exports = model('User', UserSchema);
