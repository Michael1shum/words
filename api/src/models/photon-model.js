const mongoose = require('mongoose');

const PhotonEventSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  detectorType: { type: String, required: true },
  voltage: { type: Number, required: true },
  efficiency: { type: Number, required: true },
  noise: { type: Boolean, required: true },
  detected: { type: Boolean, required: true },
  temperature: { type: Number, required: true },
  distance: { type: Number, required: true },
  mediumAttenuationFactor: { type: Number, required: true },
  probability: { type: Number, required: true } // Добавленное поле
});

module.exports = mongoose.model('PhotonEvent', PhotonEventSchema);
