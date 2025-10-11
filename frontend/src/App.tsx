import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { FileUpload } from './components/FileUpload';
import { MethodSelector } from './components/MethodSelector'; // Для шифрования
import { Decryptor } from './components/Decryptor'; // Для дешифрования
import { ResultsDisplay } from './components/ResultsDisplay'; // Результаты шифрования
import { DecryptionResult } from './components/DecryptionResult'; // Результат дешифрования
import { fetchMethods, fetchWaveform, fetchSpectrogram } from './store/appSlice';
import './App.css';

type Mode = 'encrypt' | 'decrypt';

function App() {
  const dispatch = useAppDispatch();
  const [mode, setMode] = useState<Mode>('encrypt'); // Режим по умолчанию
  
  const { 
    uploadStatus, 
    methodsStatus, 
    encryptionStatus, 
    decryptionStatus 
  } = useAppSelector((state) => state.app);

  // Эта логика остается общей для обоих режимов:
  // после загрузки файла всегда получаем список методов.
  useEffect(() => {
    if (uploadStatus === 'succeeded' && methodsStatus === 'idle') {
      dispatch(fetchMethods());
    }
  }, [uploadStatus, methodsStatus, dispatch]);
  
  // Эта логика тоже остается, но теперь она относится только к режиму шифрования.
  // Загружаем графики после шифрования.
  // useEffect(() => {
  //   if (encryptionStatus === 'succeeded') {
  //     // Загрузка графиков исходного файла (сразу после загрузки файла)
  //     dispatch(fetchWaveform({ isOriginal: true }));
  //     dispatch(fetchSpectrogram({ isOriginal: true }));
  //     // Загрузка графиков зашифрованного файла (после шифрования)
  //     dispatch(fetchWaveform({ isOriginal: false }));
  //     dispatch(fetchSpectrogram({ isOriginal: false }));
  //   }
  // }, [encryptionStatus, dispatch]);
  
  // Определяем, что показывать пользователю
  const isFileUploadedAndMethodsReady = uploadStatus === 'succeeded' && methodsStatus === 'succeeded';

  return (
    <div className="App">
      <header>
        <h1>Стеганография в аудио</h1>
      </header>
      <main>
        {/* Компонент загрузки файла общий для обоих режимов */}
        <FileUpload />

        {/* Показываем выбор режима только после загрузки файла */}
        {uploadStatus === 'succeeded' && (
          <div className="mode-selector">
            <button 
              onClick={() => setMode('encrypt')} 
              disabled={mode === 'encrypt'}
            >
              Зашифровать
            </button>
            <button 
              onClick={() => setMode('decrypt')} 
              disabled={mode === 'decrypt'}
            >
              Расшифровать
            </button>
          </div>
        )}

        {/* Показываем нужный интерфейс в зависимости от режима */}
        {isFileUploadedAndMethodsReady && (
          <>
            {mode === 'encrypt' && <MethodSelector />}
            {mode === 'decrypt' && <Decryptor />}
          </>
        )}

        {/* Показываем результаты для каждого режима */}
        {encryptionStatus === 'succeeded' && mode === 'encrypt' && <ResultsDisplay />}
        {decryptionStatus === 'succeeded' && mode === 'decrypt' && <DecryptionResult />}
      </main>
    </div>
  );
}

export default App;