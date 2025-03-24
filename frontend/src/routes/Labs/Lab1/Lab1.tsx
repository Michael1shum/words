import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, InputNumber } from 'antd';
import { PhotonEvent, ExperimentParams } from '@/App/types';

export const Lab1 = () => {
  const [events, setEvents] = useState<PhotonEvent[]>([]);
  const [experimentParams, setExperimentParams] = useState<ExperimentParams>({
    voltage: 5,
    efficiency: 0.8,
    noiseLevel: 0.1,
    distance: 10,
    mediumAttenuationFactor: 0.9,
    temperature: 25,
    temperatureSensitivity: 10,
    detectorNoiseLevel: 0.05,
    failureRate: 0.01,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const response = await axios.get<PhotonEvent[]>('/api/labs/events');
    // Сортируем события, чтобы новые эксперименты были первыми
    const sortedEvents = response.data.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setEvents(sortedEvents);
  };

  const runExperiment = async () => {
    await axios.post('/api/labs/simulate', experimentParams);
    fetchEvents();
  };

  const handleDeleteAllEvents = async () => {
    try {
      const response = await axios.delete('/api/labs/events');
      if (response.status === 200) {
        alert('Все испытания удалены');
        fetchEvents(); // Перезагружаем список событий
      }
    } catch (error) {
      console.error('Ошибка при удалении всех испытаний:', error);
    }
  };

  // Функции для изменения значений параметров
  const handleVoltageChange = (value: number | string) => {
    setExperimentParams((prevParams) => ({ ...prevParams, voltage: value as number }));
  };

  const handleEfficiencyChange = (value: number | string) => {
    setExperimentParams((prevParams) => ({ ...prevParams, efficiency: value as number }));
  };

  const handleNoiseLevelChange = (value: number | string) => {
    setExperimentParams((prevParams) => ({ ...prevParams, noiseLevel: value as number }));
  };

  const handleDistanceChange = (value: number | string) => {
    setExperimentParams((prevParams) => ({ ...prevParams, distance: value as number }));
  };

  const handleMediumAttenuationFactorChange = (value: number | string) => {
    setExperimentParams((prevParams) => ({ ...prevParams, mediumAttenuationFactor: value as number }));
  };

  const handleTemperatureChange = (value: number | string) => {
    setExperimentParams((prevParams) => ({ ...prevParams, temperature: value as number }));
  };

  const handleTemperatureSensitivityChange = (value: number | string) => {
    setExperimentParams((prevParams) => ({ ...prevParams, temperatureSensitivity: value as number }));
  };

  const handleDetectorNoiseLevelChange = (value: number | string) => {
    setExperimentParams((prevParams) => ({ ...prevParams, detectorNoiseLevel: value as number }));
  };

  const handleFailureRateChange = (value: number | string) => {
    setExperimentParams((prevParams) => ({ ...prevParams, failureRate: value as number }));
  };

  const columns = [
    { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
    { title: 'Voltage', dataIndex: 'voltage', key: 'voltage' },
    { title: 'Efficiency', dataIndex: 'efficiency', key: 'efficiency' },
    { title: 'Noise', dataIndex: 'noise', key: 'noise', render: (val: boolean) => (val ? 'Yes' : 'No') },
    { title: 'Photon Detected', dataIndex: 'detected', key: 'detected', render: (val: boolean) => (val ? 'Yes' : 'No') }
  ];

  return (
    <div>
      <h1>Лабораторные работы</h1>
      <div>
        <InputNumber
          value={experimentParams.voltage}
          onChange={handleVoltageChange}
          style={{ marginRight: '10px' }}
        /> Вольтаж
        <InputNumber
          value={experimentParams.efficiency}
          onChange={handleEfficiencyChange}
          step={0.1}
          max={1}
          min={0}
          style={{ marginRight: '10px' }}
        /> Эффективность
        <InputNumber
          value={experimentParams.noiseLevel}
          onChange={handleNoiseLevelChange}
          step={0.05}
          max={1}
          min={0}
          style={{ marginRight: '10px' }}
        /> Уровень шума
        <InputNumber
          value={experimentParams.distance}
          onChange={handleDistanceChange}
          style={{ marginRight: '10px' }}
        /> Расстояние
        <InputNumber
          value={experimentParams.mediumAttenuationFactor}
          onChange={handleMediumAttenuationFactorChange}
          style={{ marginRight: '10px' }}
        /> Коэффициент ослабления среды
        <InputNumber
          value={experimentParams.temperature}
          onChange={handleTemperatureChange}
          style={{ marginRight: '10px' }}
        /> Температура
        <InputNumber
          value={experimentParams.temperatureSensitivity}
          onChange={handleTemperatureSensitivityChange}
          style={{ marginRight: '10px' }}
        /> Чувствительность к температуре
        <InputNumber
          value={experimentParams.detectorNoiseLevel}
          onChange={handleDetectorNoiseLevelChange}
          style={{ marginRight: '10px' }}
        /> Уровень шума детектора
        <InputNumber
          value={experimentParams.failureRate}
          onChange={handleFailureRateChange}
          style={{ marginRight: '10px' }}
        /> Вероятность сбоя системы
        <Button onClick={runExperiment} style={{ marginLeft: '10px' }}>
          Запустить эксперимент
        </Button>
        <Button onClick={handleDeleteAllEvents} style={{ marginLeft: '10px' }} danger>
          Удалить все испытания
        </Button>
      </div>
      <Table dataSource={events} columns={columns} rowKey='_id' />
    </div>
  );
};
