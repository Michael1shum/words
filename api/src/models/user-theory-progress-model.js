const mongoose = require('mongoose');

const userTheoryProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  theoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theory', required: true },
  readAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserTheoryProgress', userTheoryProgressSchema);
