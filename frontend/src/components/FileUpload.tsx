import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { uploadFile, resetState } from '../store/appSlice';

export const FileUpload = () => {
  const dispatch = useAppDispatch();
  const { uploadStatus, error } = useAppSelector((state) => state.app);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  return (
    <div>
      <h3>1. Загрузите ваш WAV файл</h3>
      <input type="file" accept=".wav" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile || uploadStatus === 'loading'}>
        {uploadStatus === 'loading' ? 'Загрузка...' : 'Загрузить'}
      </button>
      <button onClick={() => dispatch(resetState())}>Сбросить все</button>
      {uploadStatus === 'failed' && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};