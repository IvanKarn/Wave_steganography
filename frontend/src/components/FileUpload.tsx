import React, { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks'; // Создадим эти хуки для TS
import { uploadFile } from '../store/appSlice';

export const FileUpload = () => {
  const dispatch = useAppDispatch();
  const { uploadStatus, uploadError } = useAppSelector((state) => state.app);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      dispatch(uploadFile(selectedFile));
    }
  };
  
  // Сброс поля ввода, чтобы можно было загрузить тот же файл еще раз
  const handleResetClick = () => {
    setSelectedFile(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <div>
      <h3>1. Загрузите ваш WAV файл</h3>
      <input type="file" accept=".wav" onChange={handleFileChange} ref={fileInputRef} />
      <button onClick={handleUpload} disabled={!selectedFile || uploadStatus === 'loading'}>
        {uploadStatus === 'loading' ? 'Загрузка...' : 'Загрузить'}
      </button>
      <button onClick={handleResetClick}>Сброс</button>
      {uploadStatus === 'failed' && <p style={{ color: 'red' }}>Ошибка: {uploadError}</p>}
    </div>
  );
};