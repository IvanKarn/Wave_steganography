import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { encryptFile } from '../store/appSlice';

export const MethodSelector = () => {
  const dispatch = useAppDispatch();
  const { encryptionMethods, encryptionStatus, error } = useAppSelector((state) => state.app);
  const [selectedMethod, setSelectedMethod] = useState<number | ''>('');

  useEffect(() => {
    // Устанавливаем метод по умолчанию при загрузке
    if (encryptionMethods.length > 0) {
      setSelectedMethod(encryptionMethods[0].id);
    }
  }, [encryptionMethods]);

  const handleEncrypt = () => {
    if (selectedMethod) {
      dispatch(encryptFile(selectedMethod));
    }
  };

  return (
    <div>
      <h3>2. Выберите метод шифрования</h3>
      <select 
        value={selectedMethod}
        onChange={(e) => setSelectedMethod(Number(e.target.value))}
      >
        {encryptionMethods.map((method) => (
          <option key={method.id} value={method.id}>
            {method.name}
          </option>
        ))}
      </select>
      <button onClick={handleEncrypt} disabled={!selectedMethod || encryptionStatus === 'loading'}>
        {encryptionStatus === 'loading' ? 'Шифрование...' : 'Зашифровать'}
      </button>
      {encryptionStatus === 'failed' && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};