import { FileUpload } from './components/FileUpload';
import { MethodSelector } from './components/MethodSelector';
import { ResultsDisplay } from './components/ResultsDisplay';
import { useAppSelector } from './store/hooks';
import './App.css'; // Можно добавить немного стилей

function App() {
  const { cookie1, cookie2, uploadStatus } = useAppSelector((state) => state.app);

  const isFileUploaded = cookie1 && uploadStatus === 'succeeded';
  const isEncryptionComplete = cookie2;

  return (
    <div className="App">
      <header>
        <h1>Стеганография в аудио</h1>
      </header>
      <main>
        <FileUpload />
        
        {/* Показываем выбор метода только после успешной загрузки файла */}
        {isFileUploaded && <MethodSelector />}
        
        {/* Показываем результаты только после успешного шифрования */}
        {isEncryptionComplete && <ResultsDisplay />}
      </main>
    </div>
  );
}

export default App;