import { useAppDispatch, useAppSelector } from '../store/hooks';
import { WaveformChart } from './WaveformChart';
import { SpectrogramChart } from './SpectrogramChart';
import { downloadResultFile } from '../store/appSlice';

export const ResultsDisplay = () => {
  const dispatch = useAppDispatch();
  const { 
    originalWaveform, encryptedWaveform,
    originalSpectrogram, encryptedSpectrogram 
  } = useAppSelector((state) => state.app);
  
  const handleDownload = async () => {
    const resultAction = await dispatch(downloadResultFile());
    if (downloadResultFile.fulfilled.match(resultAction)) {
      const blob = resultAction.payload;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'encrypted_audio.wav');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }
  };
  
  // Проверяем, что все 4 набора данных загружены
  const areAllChartsReady = originalWaveform && encryptedWaveform && originalSpectrogram && encryptedSpectrogram;

  if (!areAllChartsReady) {
    return <p>Загрузка данных для графиков...</p>
  }

  return (
    <div>
      <h3>3. Результаты</h3>
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <WaveformChart chartData={originalWaveform} label="Исходная волновая форма" />
        <WaveformChart chartData={encryptedWaveform} label="Зашифрованная волновая форма" />
        <SpectrogramChart chartData={originalSpectrogram} label="Исходная спектрограмма" />
        <SpectrogramChart chartData={encryptedSpectrogram} label="Зашифрованная спектрограмма" />
      </div>
      <button onClick={handleDownload} style={{ marginTop: '20px' }}>
        Скачать зашифрованный файл
      </button>
    </div>
  );
};