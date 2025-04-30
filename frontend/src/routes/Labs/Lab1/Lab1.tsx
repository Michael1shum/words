import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, InputNumber, Radio, Card, Typography, Row, Col } from 'antd';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, ScatterChart, Scatter, ReferenceLine, LabelList
} from 'recharts';
import { DetectorType, DETECTOR_PRESETS, PhotonEvent, ExperimentParams, ExperimentResult } from '@/routes/types';

const { Title, Text } = Typography;

export const Lab1 = () => {
  const [numTrials, setNumTrials] = useState(100);
  const [events, setEvents] = useState<PhotonEvent[]>([]);
  const [detectorType, setDetectorType] = useState<DetectorType>('SNSPD');
  const [isRunning, setIsRunning] = useState(false);
  const [experimentParams, setExperimentParams] = useState<ExperimentParams>({
    detectorType: 'SNSPD',
    temperature: DETECTOR_PRESETS.SNSPD.optimalTemperature,
    distance: 50,
    mediumAttenuationFactor: DETECTOR_PRESETS.SNSPD.mediumAttenuationFactor,
    voltage: DETECTOR_PRESETS.SNSPD.voltage,
    efficiency: DETECTOR_PRESETS.SNSPD.efficiency,
    noiseLevel: DETECTOR_PRESETS.SNSPD.noiseLevel,
    temperatureSensitivity: DETECTOR_PRESETS.SNSPD.temperatureSensitivity,
    detectorNoiseLevel: DETECTOR_PRESETS.SNSPD.detectorNoiseLevel,
    failureRate: DETECTOR_PRESETS.SNSPD.failureRate,
  });
  const [results, setResults] = useState<ExperimentResult[]>([]);
  const [stats, setStats] = useState({
    successCount: 0,
    failureCount: 0,
    noiseCount: 0,
    successRate: 0,
  });

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

  useEffect(() => {
    if (results.length > 0) {
      const successCount = results.filter(r => r.detected).length;
      const noiseCount = results.filter(r => r.noise).length;
      const failureCount = results.length - successCount;

      setStats({
        successCount,
        failureCount,
        noiseCount,
        successRate: successCount / results.length,
      });
    }
  }, [results]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get<PhotonEvent[]>('/api/labs/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке данных:', error);
    }
  };

  const runExperiment = async () => {
    setIsRunning(true);
    setResults([]);

    try {
      const response = await axios.post<ExperimentResult[]>('/api/labs/simulate', {
        ...experimentParams,
        numTrials,
      });

      setResults(response.data);
      await fetchEvents();
    } catch (error) {
      console.error('Ошибка при проведении эксперимента:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleDeleteAllEvents = async () => {
    try {
      await axios.delete('/api/labs/events');
      await fetchEvents();
      setResults([]);
    } catch (error) {
      console.error('Ошибка при удалении результатов:', error);
    }
  };

  const handleDetectorTypeChange = (e: any) => {
    const newType = e.target.value as DetectorType;
    const newPreset = DETECTOR_PRESETS[newType];

    setDetectorType(newType);
    setExperimentParams({
      ...newPreset,
      detectorType: newType,
      temperature: newPreset.optimalTemperature,
      distance: 50
    });
  };

  const prepareChartData = () => {
    return results.map((result, index) => ({
      trial: index + 1,
      detected: result.detected ? 1 : 0,
      noise: result.noise ? 1 : 0,
    }));
  };

  const prepareCumulativeData = () => {
    const data = [];
    let successCount = 0;

    for (let i = 0; i < results.length; i++) {
      if (results[i].detected) successCount++;
      data.push({
        trial: i + 1,
        cumulativeRate: successCount / (i + 1),
      });
    }

    return data;
  };

  const prepareHistogramData = () => {
    return [
      { name: 'Успешные', value: stats.successCount, fill: '#4CAF50' },
      { name: 'Неуспешные', value: stats.failureCount, fill: '#F44336' },
      { name: 'Шумы', value: stats.noiseCount, fill: '#FFC107' },
    ];
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
              onChange={(value) => setExperimentParams({...experimentParams, temperature: value || 0})}
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
              onChange={(value) => setExperimentParams({...experimentParams, distance: value || 0})}
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
              onChange={(value) => setExperimentParams({...experimentParams, mediumAttenuationFactor: value || 0})}
              min={0.1}
              max={1}
              step={0.01}
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>Напряжение (V)</Text>
            <InputNumber
              value={experimentParams.voltage}
              onChange={(value) => setExperimentParams({...experimentParams, voltage: value || 0})}
              min={0.1}
              max={detectorType === 'SNSPD' ? 10 : 100}
              step={0.1}
              style={{ width: '100%' }}
              addonAfter="V"
            />
          </div>

          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>Эффективность</Text>
            <InputNumber
              value={experimentParams.efficiency}
              onChange={(value) => setExperimentParams({...experimentParams, efficiency: value || 0})}
              min={0.01}
              max={1}
              step={0.01}
              style={{ width: '100%' }}
              formatter={(value) => `${(Number(value) * 100).toFixed(0)}%`}
              parser={(value) => Number(value?.replace('%', '')) / 100}
            />
          </div>

          <div>
            <Text strong style={{ display: 'block', marginBottom: '8px' }}>Уровень шума</Text>
            <InputNumber
              value={experimentParams.noiseLevel}
              onChange={(value) => setExperimentParams({...experimentParams, noiseLevel: value || 0})}
              min={0}
              max={1}
              step={0.001}
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

        <div style={{ marginTop: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Text strong>Количество испытаний:</Text>
          <InputNumber
            min={1}
            max={1000}
            value={numTrials}
            onChange={(value) => setNumTrials(value || 1)}
            style={{ width: '100px' }}
          />
          <Button
            type="primary"
            onClick={runExperiment}
            size="large"
            style={{ minWidth: '200px' }}
            loading={isRunning}
          >
            {isRunning ? 'Выполняется...' : 'Запустить эксперимент'}
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

      {results.length > 0 && (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col span={24}>
              <Card title="Результаты эксперимента">
                <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                  <div>
                    <Text strong style={{ display: 'block' }}>Успешные детектирования</Text>
                    <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
                      {stats.successCount}
                    </Text>
                  </div>
                  <div>
                    <Text strong style={{ display: 'block' }}>Неуспешные</Text>
                    <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#F44336' }}>
                      {stats.failureCount}
                    </Text>
                  </div>
                  <div>
                    <Text strong style={{ display: 'block' }}>Шумы</Text>
                    <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFC107' }}>
                      {stats.noiseCount}
                    </Text>
                  </div>
                  <div>
                    <Text strong style={{ display: 'block' }}>Успешность</Text>
                    <Text style={{ fontSize: '24px', fontWeight: 'bold' }}>
                      {(stats.successRate * 100).toFixed(1)}%
                    </Text>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col span={12}>
              <Card title="Гистограмма результатов">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={prepareHistogramData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value">
                      <LabelList dataKey="value" position="top" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Точечный график детектирования">
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="trial" name="Попытка" />
                    <YAxis dataKey="detected" name="Детектировано" domain={[-0.1, 1.1]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                    <Scatter name="Результаты" data={prepareChartData()} fill="#8884d8" />
                    <ReferenceLine y={0.5} stroke="#000" strokeDasharray="3 3" />
                  </ScatterChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col span={24}>
              <Card title="Кумулятивная вероятность успеха">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={prepareCumulativeData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="trial" />
                    <YAxis domain={[0, 1]} />
                    <Tooltip formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Вероятность']} />
                    <Line type="monotone" dataKey="cumulativeRate" stroke="#8884d8" strokeWidth={2} dot={false} />
                    <ReferenceLine y={experimentParams.efficiency} stroke="red" label="Ожидаемая" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </Col>
          </Row>
        </>
      )}

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
