import React, { useState, useEffect, useCallback } from 'react';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';
import './Lab2.scss'


Chart.register(...registerables);

// Максимальные значения параметров
const MAX_PARAMS = {
  PHOTON_FREQ: 100e6,    // 100 МГц
  DARK_FREQ: 50e3,       // 50 кГц
  SIMULATION_TIME: 10e6, // 10 секунд (в мкс)
  RECOVERY_TIME: 1000000     // 1000 нс
};

type HistoryItem = {
  time: number;
  detected: number;
  missed: number;
  dark: number;
  recovery: number;
};

const sensitivityWavelengthOptions = [
  {
    material: 'Si (кремний)',
    ranges: [
      { wavelength: 450, sensitivity: 0.7, quantumEfficiency: 85 },
      { wavelength: 700, sensitivity: 0.6, quantumEfficiency: 80 },
      { wavelength: 1000, sensitivity: 0.4, quantumEfficiency: 55 },
    ],
  },
  {
    material: 'Ge (германий)',
    ranges: [
      { wavelength: 900, sensitivity: 0.5, quantumEfficiency: 65 },
      { wavelength: 1300, sensitivity: 0.6, quantumEfficiency: 70 },
      { wavelength: 1550, sensitivity: 0.6, quantumEfficiency: 70 },
    ],
  },
  {
    material: 'InGaAs',
    ranges: [
      { wavelength: 1100, sensitivity: 0.7, quantumEfficiency: 75 },
      { wavelength: 1400, sensitivity: 0.8, quantumEfficiency: 85 },
      { wavelength: 1600, sensitivity: 0.85, quantumEfficiency: 88 },
    ],
  },
];

export const Lab2: React.FC = () => {
  const [selectedMaterial, setSelectedMaterial] = useState(sensitivityWavelengthOptions[0].material);
  const [availableWavelengths, setAvailableWavelengths] = useState<number[]>([]);
  const [params, setParams] = useState({
    photonFreq: 1e6,
    recoveryTime: 10,
    wavelength: 450,
    sensitivity: 0.7,
    quantumEfficiency: 85,
    darkFreq: 1e3,
    simulationTime: 1000 // 1 мс по умолчанию
  });

  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  // Обновляем доступные длины волн при смене материала
  useEffect(() => {
    const materialObj = sensitivityWavelengthOptions.find(m => m.material === selectedMaterial);
    if (materialObj) {
      const wavelengths = materialObj.ranges.map(r => r.wavelength);
      setAvailableWavelengths(wavelengths);

      // При смене материала обновляем параметры на первый диапазон
      const firstRange = materialObj.ranges[0];
      setParams(prev => ({
        ...prev,
        wavelength: firstRange.wavelength,
        sensitivity: firstRange.sensitivity,
        quantumEfficiency: firstRange.quantumEfficiency
      }));
    }
  }, [selectedMaterial]);

  // Обновляем чувствительность и квантовую эффективность при смене длины волны
  useEffect(() => {
    const materialObj = sensitivityWavelengthOptions.find(m => m.material === selectedMaterial);
    if (materialObj) {
      const rangeObj = materialObj.ranges.find(r => r.wavelength === params.wavelength);
      if (rangeObj) {
        setParams(prev => ({
          ...prev,
          sensitivity: rangeObj.sensitivity,
          quantumEfficiency: rangeObj.quantumEfficiency
        }));
      }
    }
  }, [params.wavelength, selectedMaterial]);

  // Оптимизированная симуляция с использованием requestAnimationFrame
  const runSimulation = useCallback(() => {
    setIsRunning(true);
    setProgress(0);
    setResults(null);

    const {
      photonFreq,
      recoveryTime,
      wavelength,
      sensitivity,
      darkFreq,
      simulationTime,
      quantumEfficiency
    } = params;

    // QE уже в процентах
    const QE = quantumEfficiency;
    const totalSteps = Math.floor(simulationTime * 1000); // шаги по 1 нс
    const photonInterval = photonFreq > 0 ? 1e9 / photonFreq : Infinity;
    const darkInterval = darkFreq > 0 ? 1e9 / darkFreq : Infinity;

    let detected = 0;
    let missed = 0;
    let dark = 0;
    let recoveryEndTime = 0;
    let nextPhotonTime = 0;
    let nextDarkTime = 0;

    // Уменьшаем частоту сохранения данных
    const historyInterval = Math.max(1000, Math.floor(totalSteps / 1000));
    const history: any[] = [];

    let currentStep = 0;

    console.log('--- Simulation started ---');
    console.log(`Photon Frequency (Hz): ${photonFreq}`);
    console.log(`Dark Count Frequency (Hz): ${darkFreq}`);
    console.log(`Recovery Time (ns): ${recoveryTime}`);
    console.log(`Wavelength (nm): ${wavelength}`);
    console.log(`Sensitivity (A/W): ${sensitivity}`);
    console.log(`Quantum Efficiency (%): ${quantumEfficiency}`);
    console.log(`Simulation Time (µs): ${simulationTime}`);
    console.log(`Total Steps: ${totalSteps} (1 step = 1 ns)`);
    console.log(`Photon Interval (ns): ${photonInterval}`);
    console.log(`Dark Interval (ns): ${darkInterval}`);


    const simulateChunk = () => {
      // Ограничиваем время выполнения одного фрейма
      const maxStepsPerFrame = Math.floor(totalSteps / 100);

      for (let i = 0; i < maxStepsPerFrame && currentStep < totalSteps; i++, currentStep++) {
        const currentTime = currentStep; // в нс

        // Темновые события
        if (currentTime >= nextDarkTime) {
          if (currentTime >= recoveryEndTime) {
            console.log(`[${currentTime} ns] DARK event → registered`);
            dark++;
            recoveryEndTime = currentTime + recoveryTime;
          }
          nextDarkTime += darkInterval;
        }

        // Фотоны
        if (currentTime >= nextPhotonTime) {
          if (currentTime > recoveryEndTime) {
            const random = Math.random() * 100;

            if (random <= QE) {
              detected++;
              console.log(`[${currentTime} ns] PHOTON → detected (QE ${random.toFixed(2)} <= ${QE})`);
              recoveryEndTime = currentTime + recoveryTime;
            } else {
              missed++;
              console.log(`[${currentTime} ns] PHOTON → missed (QE ${random.toFixed(2)} > ${QE})`);
            }

            console.log(
              `→ Params: t=${currentTime} ns | QE=${QE}% | rand=${random.toFixed(2)} | recoveryEndTime=${recoveryEndTime} ns`
            );
          } else {
            missed++;
            console.log(`[${currentTime} ns] PHOTON → during recovery (recoveryEndTime=${recoveryEndTime} ns)`);
          }

          nextPhotonTime += photonInterval;
        }


        // Сохраняем историю реже
        if (currentStep % historyInterval === 0) {
          history.push({
            time: currentTime / 1e3, // в мкс
            detected,
            missed,
            dark,
            recovery: currentTime < recoveryEndTime ? 1 : 0
          });
        }
      }

      // Обновляем прогресс
      const newProgress = Math.round((currentStep / totalSteps) * 100);
      if (newProgress !== progress) {
        setProgress(newProgress);
      }

      // Проверяем завершение
      if (currentStep >= totalSteps) {
        console.log('--- Simulation finished ---');
        console.log(`Detected photons: ${detected}`);
        console.log(`Missed photons: ${missed}`);
        console.log(`Dark counts: ${dark}`);
        console.log(`Effective efficiency: ${((detected / (detected + missed)) * 100).toFixed(2)}%`);
        console.log(`Total time (ns): ${totalSteps}`);
        const effectiveEff = detected / (detected + missed) * 100;
        setResults({
          detectedPhotons: detected,
          missedPhotons: missed,
          darkCounts: dark,
          quantumEfficiency: QE,
          effectiveEfficiency: effectiveEff,
          history
        });
        setIsRunning(false);
      } else {
        // Продолжаем симуляцию в следующем фрейме
        requestAnimationFrame(simulateChunk);
      }
    };

    requestAnimationFrame(simulateChunk);
  }, [params, progress]);

  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'material') {
      setSelectedMaterial(value);
      return;
    }

    let numValue = parseFloat(value);

    // Применяем ограничения
    switch (name) {
      case 'photonFreq':
        numValue = Math.min(numValue, MAX_PARAMS.PHOTON_FREQ);
        break;
      case 'darkFreq':
        numValue = Math.min(numValue, MAX_PARAMS.DARK_FREQ);
        break;
      case 'simulationTime':
        numValue = Math.min(numValue, MAX_PARAMS.SIMULATION_TIME);
        break;
      case 'recoveryTime':
        numValue = Math.min(numValue, MAX_PARAMS.RECOVERY_TIME);
        break;
      case 'wavelength': {
        // Проверим, есть ли в доступных длинах волн
        if (!availableWavelengths.includes(numValue)) {
          return; // игнорируем неправильное значение
        }
        break;
      }
      case 'sensitivity':
        // Вручную не даём менять чувствительность (она зависит от материала и длины волны)
        return;
    }

    setParams(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const renderRecoveryChart = () => {
    if (!results || results.history.length === 0) return null;

    const slicedHistory = results.history.slice(-100);
    const timeData = slicedHistory.map((h: HistoryItem) => h.time);
    const recoveryData = slicedHistory.map((h: HistoryItem) => h.recovery);

    return (
      <div className="chart-container">
        <h4>Состояние детектора (последние 100 точек)</h4>
        <Line
          data={{
            labels: timeData,
            datasets: [{
              label: 'Состояние',
              data: recoveryData,
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderWidth: 1,
              pointRadius: 2,
              stepped: true
            }]
          }}
          options={{
            responsive: true,
            scales: {
              x: {
                title: { display: true, text: 'Время (мкс)' }
              },
              y: {
                title: { display: true, text: 'Режим детектора (0/1)' },
                min: 0,
                max: 1,
                ticks: {
                  stepSize: 1,
                  callback: v => (v === 1 ? 'Восстановление' : 'Готов')
                }
              }
            },
            plugins: {
              legend: { display: false }
            }
          }}
        />
      </div>
    );
  };

  return (
    <div className="lab2-container">
      <h2>Виртуальная лаборатория: Симуляция регистрации фотонов</h2>

      <div className="params-container">
        <div className="param">
          <label>Материал:</label>
          <select
            name="material"
            value={selectedMaterial}
            onChange={handleParamChange}
            disabled={isRunning}
          >
            {sensitivityWavelengthOptions.map((mat, i) => (
              <option key={i} value={mat.material}>
                {mat.material}
              </option>
            ))}
          </select>
        </div>

        <div className="param">
          <label>Длина волны (нм):</label>
          <select
            name="wavelength"
            value={params.wavelength}
            onChange={handleParamChange}
            disabled={isRunning}
          >
            {availableWavelengths.map((wl, i) => {
              const materialObj = sensitivityWavelengthOptions.find(m => m.material === selectedMaterial);
              const rangeObj = materialObj?.ranges.find(r => r.wavelength === wl);
              return (
                <option key={i} value={wl}>
                  {wl} нм (Чувствительность: {rangeObj?.sensitivity}, QE: {rangeObj?.quantumEfficiency}%)
                </option>
              );
            })}
          </select>
        </div>

        <div className="param">
          <label>Чувствительность (А/Вт):</label>
          <input
            type="number"
            value={params.sensitivity}
            disabled
          />
        </div>

        <div className="param">
          <label>Квантовая эффективность (%):</label>
          <input
            type="number"
            value={params.quantumEfficiency}
            disabled
          />
        </div>

        <div className="param">
          <label>Частота фотонов (Гц):</label>
          <input
            type="number"
            name="photonFreq"
            value={params.photonFreq}
            onChange={handleParamChange}
            disabled={isRunning}
            min={0}
            max={MAX_PARAMS.PHOTON_FREQ}
          />
        </div>

        <div className="param">
          <label>Частота темнового счёта (Гц):</label>
          <input
            type="number"
            name="darkFreq"
            value={params.darkFreq}
            onChange={handleParamChange}
            disabled={isRunning}
            min={0}
            max={MAX_PARAMS.DARK_FREQ}
          />
        </div>

        <div className="param">
          <label>Время восстановления детектора (нс):</label>
          <input
            type="number"
            name="recoveryTime"
            value={params.recoveryTime}
            onChange={handleParamChange}
            disabled={isRunning}
            min={1}
            max={MAX_PARAMS.RECOVERY_TIME}
          />
        </div>

        <div className="param">
          <label>Время симуляции (мкс):</label>
          <input
            type="number"
            name="simulationTime"
            value={params.simulationTime}
            onChange={handleParamChange}
            disabled={isRunning}
            min={1}
            max={MAX_PARAMS.SIMULATION_TIME}
          />
        </div>
      </div>

      <div className="buttons">
        <button onClick={runSimulation} disabled={isRunning}>
          Запустить симуляцию
        </button>
      </div>

      <div className="progress-bar">
        <progress max={100} value={progress}></progress> {progress}%
      </div>

      {results && (
        <div className="results">
          <h3>Результаты симуляции</h3>
          <p>Успешно зарегистрировано фотонов: {results.detectedPhotons}</p>
          <p>Пропущено фотонов: {results.missedPhotons}</p>
          <p>Темновые счёты: {results.darkCounts}</p>
          <p>Квантовая эффективность (задано): {results.quantumEfficiency}%</p>
          <p>Эффективность регистрации (учитывая восстановление): {results.effectiveEfficiency.toFixed(2)}%</p>

          {renderRecoveryChart()}
        </div>
      )}

      <style>{`
        .lab2-container {
          max-width: 800px;
          margin: 20px auto;
          font-family: Arial, sans-serif;
          padding: 20px;
          background: #f8f8f8;
          border-radius: 8px;
        }
        .params-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .param {
          flex: 1 1 45%;
          display: flex;
          flex-direction: column;
          margin-bottom: 10px;
        }
        .param label {
          margin-bottom: 5px;
          font-weight: bold;
        }
        .param input, .param select {
          padding: 5px;
          font-size: 1rem;
        }
        .buttons {
          margin: 10px 0;
        }
        button {
          padding: 10px 20px;
          font-size: 1rem;
          cursor: pointer;
          border: none;
          background-color: #007bff;
          color: white;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }
        button:disabled {
          background-color: #7aa7d9;
          cursor: not-allowed;
        }
        .progress-bar {
          margin: 10px 0;
        }
        .results {
          margin-top: 20px;
          background: white;
          padding: 15px;
          border-radius: 6px;
          box-shadow: 0 0 5px rgba(0,0,0,0.1);
        }
        .chart-container {
          margin-top: 20px;
        }
      `}</style>
    </div>
  );
};
