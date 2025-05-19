import React, { useState, useEffect, useCallback } from 'react';
import { Chart, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';

Chart.register(...registerables);

// Максимальные значения параметров
const MAX_PARAMS = {
  PHOTON_FREQ: 100e6,    // 100 МГц
  DARK_FREQ: 50e3,       // 50 кГц
  SIMULATION_TIME: 10e6,  // 10 секунд (в мкс)
  RECOVERY_TIME: 1000     // 1000 нс
};

export const Lab2: React.FC = () => {
  const [params, setParams] = useState({
    photonFreq: 1e6,
    recoveryTime: 10,
    wavelength: 800,
    sensitivity: 0.7,
    darkFreq: 1e3,
    simulationTime: 1000 // 1 мс по умолчанию
  });

  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [progress, setProgress] = useState(0);

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
      simulationTime
    } = params;

    // Рассчитываем константы один раз
    const QE = (1240 * sensitivity) / wavelength * 100;
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

    let lastUpdate = 0;
    let currentStep = 0;

    const simulateChunk = (timestamp: number) => {
      // Ограничиваем время выполнения одного фрейма
      const maxStepsPerFrame = Math.floor(totalSteps / 100);

      for (let i = 0; i < maxStepsPerFrame && currentStep < totalSteps; i++, currentStep++) {
        const currentTime = currentStep; // в нс

        // Темновые события
        if (currentTime >= nextDarkTime) {
          if (currentTime >= recoveryEndTime) {
            dark++;
            recoveryEndTime = currentTime + recoveryTime;
          }
          nextDarkTime += darkInterval;
        }

        // Фотоны
        if (currentTime >= nextPhotonTime) {
          if (currentTime >= recoveryEndTime) {
            if (Math.random() * 100 <= QE) {
              detected++;
              recoveryEndTime = currentTime + recoveryTime;
            } else {
              missed++;
            }
          } else {
            missed++;
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
  }, [params]);

  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
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
    }

    setParams(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const renderRecoveryChart = () => {
    if (!results || results.history.length === 0) return null;

    // Берем только последние 100 точек для графика восстановления
    const slicedHistory = results.history.slice(-100);
    const timeData = slicedHistory.map(h => h.time);
    const recoveryData = slicedHistory.map(h => h.recovery);

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
                title: { display: true, text: 'Состояние' },
                min: 0,
                max: 1,
                ticks: {
                  stepSize: 1,
                  callback: (value) => value === 0 ? 'Активен' : 'Восстановление'
                }
              }
            },
            animation: {
              duration: 0
            }
          }}
        />
      </div>
    );
  };

  const renderResults = () => {
    if (!results) return null;

    // Для основного графика берем каждую 10-ю точку (чтобы не перегружать)
    const sampledHistory = results.history.filter((_, i) => i % 10 === 0);
    const timeData = sampledHistory.map(h => h.time);
    const detectedData = sampledHistory.map(h => h.detected);
    const missedData = sampledHistory.map(h => h.missed);
    const darkData = sampledHistory.map(h => h.dark);

    return (
      <div className="results">
        <h3>Результаты</h3>
        <div className="stats">
          <p>Квантовая эффективность: {results.quantumEfficiency.toFixed(2)}%</p>
          <p>Эффективность детектирования: {results.effectiveEfficiency.toFixed(2)}%</p>
          <p>Детектировано фотонов: {results.detectedPhotons.toLocaleString()}</p>
          <p>Пропущено фотонов: {results.missedPhotons.toLocaleString()}</p>
          <p>Темновые события: {results.darkCounts.toLocaleString()}</p>
        </div>

        <div className="charts">
          <div className="chart-container">
            <h4>Статистика детектирования (каждая 10-я точка)</h4>
            <Line
              data={{
                labels: timeData,
                datasets: [
                  {
                    label: 'Детектированные фотоны',
                    data: detectedData,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.1
                  },
                  {
                    label: 'Пропущенные фотоны',
                    data: missedData,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.1
                  },
                  {
                    label: 'Темновые события',
                    data: darkData,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    tension: 0.1
                  }
                ]
              }}
              options={{
                responsive: true,
                scales: {
                  x: { title: { display: true, text: 'Время (мкс)' } },
                  y: { title: { display: true, text: 'Количество' } }
                },
                animation: {
                  duration: 0
                }
              }}
            />
          </div>

          {renderRecoveryChart()}
        </div>
      </div>
    );
  };

  return (
    <div className="photon-detector-lab">
      <h2>Виртуальная лаборатория: Детектирование фотонов</h2>

      <div className="controls">
        <div className="param-group">
          <div className="param">
            <label>Частота фотонов (Гц):</label>
            <input
              type="number"
              name="photonFreq"
              value={params.photonFreq}
              onChange={handleParamChange}
              min="0"
              step="1000"
              disabled={isRunning}
            />
          </div>

          <div className="param">
            <label>Время восстановления (нс):</label>
            <input
              type="number"
              name="recoveryTime"
              value={params.recoveryTime}
              onChange={handleParamChange}
              min="0"
              step="0.1"
              disabled={isRunning}
            />
          </div>
        </div>

        <div className="param-group">
          <div className="param">
            <label>Длина волны (нм):</label>
            <input
              type="number"
              name="wavelength"
              value={params.wavelength}
              onChange={handleParamChange}
              min="100"
              max="2000"
              step="1"
              disabled={isRunning}
            />
          </div>

          <div className="param">
            <label>Чувствительность (A/W):</label>
            <input
              type="number"
              name="sensitivity"
              value={params.sensitivity}
              onChange={handleParamChange}
              min="0.1"
              max="1.0"
              step="0.01"
              disabled={isRunning}
            />
          </div>
        </div>

        <div className="param-group">
          <div className="param">
            <label>Темновая частота (Гц):</label>
            <input
              type="number"
              name="darkFreq"
              value={params.darkFreq}
              onChange={handleParamChange}
              min="0"
              step="100"
              disabled={isRunning}
            />
          </div>

          <div className="param">
            <label>Время симуляции (мкс):</label>
            <input
              type="number"
              name="simulationTime"
              value={params.simulationTime}
              onChange={handleParamChange}
              min="1"
              max="100000"
              step="1"
              disabled={isRunning}
            />
          </div>
        </div>

        <button
          onClick={runSimulation}
          disabled={isRunning}
          className={isRunning ? 'running' : ''}
        >
          {isRunning ? `Идет моделирование... (${progress}%)` : 'Запустить симуляцию'}
        </button>
      </div>

      {renderResults()}
    </div>
  );
};

