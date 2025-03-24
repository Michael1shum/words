const mongoose = require('mongoose');

const photonSchema = new mongoose.Schema({
  timestamp: Date,
  voltage: Number,
  efficiency: Number,
  noise: Boolean,
  detected: Boolean,
  distance: Number,
  mediumAttenuationFactor: Number,
  temperature: Number,
  temperatureSensitivity: Number,
  detectorNoiseLevel: Number,
  failureRate: Number,
});

module.exports = mongoose.model('PhotonEvent', photonSchema);
