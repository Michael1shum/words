const mongoose = require('mongoose');

const PhotonEventSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now }, // Время регистрации
  detectorType: { type: String, required: true }, // Тип детектора
  voltage: { type: Number, required: true }, // Напряжение
  efficiency: { type: Number, required: true }, // Квантовая эффективность
  noise: { type: Boolean, required: true }, // Шум
  detected: { type: Boolean, required: true }, // Факт детектирования
  temperature: { type: Number, required: true }, //Температура
  distance: { type: Number, required: true }, // Дистанция
  mediumAttenuationFactor: { type: Number, required: true }, // Потери в линии
  probability: { type: Number, required: true } // Вероятность детектирования
});

module.exports = mongoose.model('PhotonEvent', PhotonEventSchema);
