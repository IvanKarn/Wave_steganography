import { useState, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useAppSelector } from '../store/hooks';
import { WaveformChart } from './WaveformChart';
import { SpectrogramChart } from './SpectrogramChart';

// Типы для хранения данных
type WaveformData = number[];
type SpectrogramData = number[][];

export const ResultsDisplay = () => {
  const { cookie1, cookie2 } = useAppSelector((state) => state.app);

  // Состояния для хранения числовых данных
  const [originalWaveform, setOriginalWaveform] = useState<WaveformData | null>(null);
  const [encryptedWaveform, setEncryptedWaveform] = useState<WaveformData | null>(null);
  const [originalSpectrogram, setOriginalSpectrogram] = useState<SpectrogramData | null>(null);
  const [encryptedSpectrogram, setEncryptedSpectrogram] = useState<SpectrogramData | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAllChartData = async () => {
      if (!cookie1 || !cookie2) return;
      setIsLoading(true);

      try {
        // Функция-помощник для получения данных. responseType теперь не нужен.
        const fetchData = async (url: string, token: string) => {
          const response = await apiClient.post(url, {}, { headers: { 'X-File-Token': token } });
          return response.data;
        };

        const [origGraphData, encGraphData, origSpecData, encSpecData] = await Promise.all([
          fetchData('/get_graph', cookie1),
          fetchData('/get_graph', cookie2),
          fetchData('/get_spectrogramm', cookie1),
          fetchData('/get_spectrogramm', cookie2),
        ]);

        setOriginalWaveform(origGraphData.waveform_data);
        setEncryptedWaveform(encGraphData.waveform_data);
        setOriginalSpectrogram(origSpecData.spectrogram_data);
        setEncryptedSpectrogram(encSpecData.spectrogram_data);

      } catch (error) {
        console.error("Failed to fetch chart data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllChartData();
  }, [cookie1, cookie2]);
  
  // Логика скачивания файла остается той же...
  const handleDownload = async () => { /* ... */ };

  if (isLoading) return <p>Загрузка данных для графиков...</p>;

  return (
    <div>
      <h3>3. Результаты</h3>
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        {/* Отображаем графики только если данные загружены */}
        {originalWaveform && <WaveformChart chartData={originalWaveform} label="Исходная волновая форма" />}
        {encryptedWaveform && <WaveformChart chartData={encryptedWaveform} label="Зашифрованная волновая форма" />}
        {originalSpectrogram && <SpectrogramChart chartData={originalSpectrogram} label="Исходная спектрограмма" />}
        {encryptedSpectrogram && <SpectrogramChart chartData={encryptedSpectrogram} label="Зашифрованная спектрограмма" />}
      </div>
      <button onClick={handleDownload} style={{ marginTop: '20px' }}>Скачать зашифрованный файл</button>
    </div>
  );
};