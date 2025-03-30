import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, InputNumber, Radio, Card, Typography } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { DetectorType, DETECTOR_PRESETS, PhotonEvent, ExperimentParams, ExperimentResult } from '@/routes/types';

const { Title, Text } = Typography;

export const Lab1 = () => {
  const [events, setEvents] = useState<PhotonEvent[]>([]);
  const [detectorType, setDetectorType] = useState<DetectorType>('SNSPD');
  const [experimentParams, setExperimentParams] = useState<ExperimentParams>({
    detectorType: 'SNSPD',
    temperature: DETECTOR_PRESETS.SNSPD.optimalTemperature,
    distance: 50,
    mediumAttenuationFactor: DETECTOR_PRESETS.SNSPD.mediumAttenuationFactor,
  });
  const [result, setResult] = useState<ExperimentResult | null>(null);

  const currentPreset = DETECTOR_PRESETS[detectorType];

  const calculateEfficiency = () => {
    const tempDiff = Math.abs(experimentParams.temperature - currentPreset.optimalTemperature);
    const tempEffect = Math.exp(-tempDiff / currentPreset.temperatureSensitivity);
    return currentPreset.efficiency * tempEffect;
  };

  const efficiency = calculateEfficiency();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get<PhotonEvent[]>('/api/labs/events');
      const sortedEvents = response.data.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setEvents(sortedEvents);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  const runExperiment = async () => {
    try {
      const params = {
        ...experimentParams,
        efficiency,
        noiseLevel: currentPreset.noiseLevel,
        voltage: currentPreset.voltage,
        temperatureSensitivity: currentPreset.temperatureSensitivity,
        detectorNoiseLevel: currentPreset.detectorNoiseLevel,
        failureRate: currentPreset.failureRate,
      };
      const response = await axios.post<ExperimentResult>('/api/labs/simulate', params);
      setResult(response.data);
      await fetchEvents();
    } catch (error) {
      console.error('Ошибка при проведении эксперимента:', error);
    }
  };

  const handleDeleteAllEvents = async () => {
    try {
      await axios.delete('/api/labs/events');
      await fetchEvents();
      setResult(null);
    } catch (error) {
      console.error('Ошибка при удалении результатов:', error);
    }
  };

  const handleDetectorTypeChange = (e: any) => {
    const newType = e.target.value as DetectorType;
    setDetectorType(newType);
    setExperimentParams({
      detectorType: newType,
      temperature: DETECTOR_PRESETS[newType].optimalTemperature,
      distance: 50,
      mediumAttenuationFactor: DETECTOR_PRESETS[newType].mediumAttenuationFactor,
    });
  };

  const handleTemperatureChange = (value: number | null) => {
    if (value !== null) {
      const range = currentPreset.temperatureRange;
      const clampedValue = Math.max(range[0], Math.min(range[1], value));
      setExperimentParams({ ...experimentParams, temperature: clampedValue });
    }
  };

  const handleDistanceChange = (value: number | null) => {
    if (value !== null) {
      const range = currentPreset.distanceRange;
      const clampedValue = Math.max(range[0], Math.min(range[1], value));
      setExperimentParams({ ...experimentParams, distance: clampedValue });
    }
  };

  const handleAttenuationChange = (value: number | null) => {
    if (value !== null) {
      const clampedValue = Math.max(0.1, Math.min(1, value));
      setExperimentParams({ ...experimentParams, mediumAttenuationFactor: clampedValue });
    }
  };

  const columns = [
    { title: 'Время', dataIndex: 'timestamp', key: 'timestamp', render: (t: string) => new Date(t).toLocaleString() },
    { title: 'Тип детектора', dataIndex: 'detectorType', key: 'detectorType' },
    { title: 'Вероятность', dataIndex: 'probability', key: 'probability', render: (val: number) => `${(val * 100).toFixed(1)}%` },
    { title: 'Температура (K)', dataIndex: 'temperature', key: 'temperature' },
    { title: 'Расстояние (км)', dataIndex: 'distance', key: 'distance' },
    { title: 'Детектировано', dataIndex: 'detected', key: 'detected', render: (val: boolean) => val ? 'Да' : 'Нет' },
    { title: 'Шум', dataIndex: 'noise', key: 'noise', render: (val: boolean) => val ? 'Да' : 'Нет' },
  ];

  const generateTemperatureData = () => {
    const data = [];
    const range = currentPreset.temperatureRange;
    const step = (range[1] - range[0]) / 20;

    for (let temp = range[0]; temp <= range[1]; temp += step) {
      const tempDiff = Math.abs(temp - currentPreset.optimalTemperature);
      const tempEffect = Math.exp(-tempDiff / currentPreset.temperatureSensitivity);
      data.push({
        temperature: temp.toFixed(1),
        efficiency: currentPreset.efficiency * tempEffect,
      });
    }
    return data;
  };

  const temperatureData = generateTemperatureData();

  const prepareDetectionStats = () => {
    const statsData: {
      timestamp: string;
      SNSPD_detected: number;
      SNSPD_noise: number;
      SPAD_detected: number;
      SPAD_noise: number
    }[] = [];

    // Группируем события по временным меткам
    const timeGroups: Record<string, {
      SNSPD: { detected: number; noise: number };
      SPAD: { detected: number; noise: number }
    }> = {};

    events.forEach(event => {
      const timeKey = new Date(event.timestamp).toLocaleString();
      if (!timeGroups[timeKey]) {
        timeGroups[timeKey] = {
          SNSPD: { detected: 0, noise: 0 },
          SPAD: { detected: 0, noise: 0 }
        };
      }

      if (event.detectorType === 'SNSPD') {
        timeGroups[timeKey].SNSPD.detected += event.detected ? 1 : 0;
        timeGroups[timeKey].SNSPD.noise += event.noise ? 1 : 0;
      } else {
        timeGroups[timeKey].SPAD.detected += event.detected ? 1 : 0;
        timeGroups[timeKey].SPAD.noise += event.noise ? 1 : 0;
      }
    });

    // Преобразуем в массив для графика
    Object.entries(timeGroups).forEach(([timestamp, stats]) => {
      statsData.push({
        timestamp,
        SNSPD_detected: stats.SNSPD.detected,
        SNSPD_noise: stats.SNSPD.noise,
        SPAD_detected: stats.SPAD.detected,
        SPAD_noise: stats.SPAD.noise
      });
    });

    return statsData.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const detectionStats = prepareDetectionStats();

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: '24px' }}>Лабораторная работа: Детекторы одиночных фотонов</Title>

      <Card title="Конфигурация эксперимента" style={{ marginBottom: '24px' }} bordered={false}>
        <div style={{ marginBottom: '16px' }}>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>Тип детектора:</Text>
          <Radio.Group
            onChange={handleDetectorTypeChange}
            value={detectorType}
            optionType="button"
            buttonStyle="solid"
          >
            <Radio.Button value="SNSPD">SNSPD</Radio.Button>
            <Radio.Button value="SPAD">SPAD</Radio.Button>
          </Radio.Group>
          <Text type="secondary" style={{ display: 'block', marginTop: '8px' }}>
            {currentPreset.description}
          </Text>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
              Температура ({currentPreset.temperatureRange.join('-')} K)
            </Text>
            <InputNumber
              value={experimentParams.temperature}
              onChange={handleTemperatureChange}
              min={currentPreset.temperatureRange[0]}
              max={currentPreset.temperatureRange[1]}
              step={detectorType === 'SNSPD' ? 0.1 : 1}
              style={{ width: '100%' }}
              addonAfter="K"
            />
          </div>

          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
              Расстояние ({currentPreset.distanceRange.join('-')} км)
            </Text>
            <InputNumber
              value={experimentParams.distance}
              onChange={handleDistanceChange}
              min={currentPreset.distanceRange[0]}
              max={currentPreset.distanceRange[1]}
              style={{ width: '100%' }}
              addonAfter="км"
            />
          </div>

          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
              Ослабление среды (0.1-1)
            </Text>
            <InputNumber
              value={experimentParams.mediumAttenuationFactor}
              onChange={handleAttenuationChange}
              min={0.1}
              max={1}
              step={0.01}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div style={{ marginTop: '16px', padding: '12px', background: '#f6f6f6', borderRadius: '4px' }}>
          <Text strong>Текущая эффективность: </Text>
          <Text style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
            {(efficiency * 100).toFixed(1)}%
          </Text>
          {efficiency < currentPreset.efficiency * 0.9 && (
            <Text type="warning" style={{ display: 'block', marginTop: '4px' }}>
              Эффективность снижена из-за неоптимальной температуры
            </Text>
          )}
        </div>

        <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
          <Button
            type="primary"
            onClick={runExperiment}
            size="large"
            style={{ minWidth: '200px' }}
          >
            Запустить эксперимент
          </Button>
          <Button
            danger
            onClick={handleDeleteAllEvents}
            size="large"
          >
            Очистить результаты
          </Button>
        </div>
      </Card>
      <Card title="Зависимость эффективности от температуры" style={{ marginBottom: '24px' }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={temperatureData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="temperature"
              label={{ value: 'Температура (K)', position: 'insideBottomRight', offset: -5 }}
            />
            <YAxis
              label={{ value: 'Эффективность', angle: -90, position: 'insideLeft' }}
              domain={[0, 1]}
            />
            <Tooltip
              formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Эффективность']}
              labelFormatter={(label) => `Температура: ${label} K`}
            />
            <Line
              type="monotone"
              dataKey="efficiency"
              stroke="#1890ff"
              strokeWidth={2}
              dot={false}
            />
            {experimentParams.temperature && (
              <ReferenceLine
                x={experimentParams.temperature.toFixed(1)}
                stroke="red"
                label={{ value: 'Текущая', position: 'top' }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Статистика срабатываний детекторов" style={{ marginBottom: '24px' }}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={detectionStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="SNSPD_detected"
              name="SNSPD: Детектирования"
              stroke="#8884d8"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="SNSPD_noise"
              name="SNSPD: Шумы"
              stroke="#82ca9d"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="SPAD_detected"
              name="SPAD: Детектирования"
              stroke="#ff7300"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="SPAD_noise"
              name="SPAD: Шумы"
              stroke="#ff0000"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title="История экспериментов">
        <Table
          dataSource={events}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          scroll={{ x: true }}
        />
        <Button
          onClick={handleDeleteAllEvents}
          danger
          style={{ marginTop: '16px' }}
        >
          Очистить историю
        </Button>
      </Card>
    </div>
  );
};
