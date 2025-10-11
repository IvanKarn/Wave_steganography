import { useAppDispatch, useAppSelector } from '../store/hooks';
import { WaveformChart } from './WaveformChart';
import { SpectrogramChart } from './SpectrogramChart';
import apiClient from '../api/apiClient';
import { setDownloadPending, setDownloadSuccess, setDownloadFailed } from '../store/appSlice';

export const ResultsDisplay = () => {
  const dispatch = useAppDispatch();
  const { 
//   originalWaveform, encryptedWaveform,
//    originalSpectrogram, encryptedSpectrogram,
    downloadStatus,
  } = useAppSelector((state) => state.app);
  
  const handleDownload = async () => {
    // 1. Сообщаем Redux, что скачивание НАЧАЛОСЬ
    dispatch(setDownloadPending());

    try {
      // 2. Выполняем API-запрос напрямую
      const response = await apiClient.post('/download_file', {}, { responseType: 'blob' });
      
      // 3. Обрабатываем успешный результат (Blob) здесь же, ВНЕ Redux
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'encrypted_audio.wav');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      // 4. Сообщаем Redux, что все прошло УСПЕШНО
      dispatch(setDownloadSuccess());

    } catch (error) {
      // 5. Если произошла ошибка, сообщаем Redux об этом
      console.error("Download failed:", error);
      dispatch(setDownloadFailed('Не удалось скачать файл.'));
    }
  };
  
  // Проверяем, что все 4 набора данных загружены
//  const areAllChartsReady = originalWaveform && encryptedWaveform && originalSpectrogram && encryptedSpectrogram;

  // if (!areAllChartsReady) {
  //   return <p>Загрузка данных для графиков...</p>
  // }

  return (
    <div>
      {/* <h3>3. Результаты</h3>
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        <WaveformChart chartData={originalWaveform} label="Исходная волновая форма" />
        <WaveformChart chartData={encryptedWaveform} label="Зашифрованная волновая форма" />
        <SpectrogramChart chartData={originalSpectrogram} label="Исходная спектрограмма" />
        <SpectrogramChart chartData={encryptedSpectrogram} label="Зашифрованная спектрограмма" />
      </div> */}
      <button 
        onClick={handleDownload} 
        style={{ marginTop: '20px' }}
        disabled={downloadStatus === 'loading'}
      >
        {downloadStatus === 'loading' ? 'Скачивание...' : 'Скачать зашифрованный файл'}
      </button>
    </div>
  );
};