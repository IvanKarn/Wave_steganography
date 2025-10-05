import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { encryptFile } from '../store/appSlice';

export const MethodSelector = () => {
  const dispatch = useAppDispatch();
  const { encryptionMethods, encryptionStatus, error } = useAppSelector((state) => state.app);
  const [selectedMethod, setSelectedMethod] = useState<number | ''>('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Устанавливаем метод по умолчанию при загрузке
    if (encryptionMethods.length > 0) {
      setSelectedMethod(encryptionMethods[0].id);
    }
  }, [encryptionMethods]);

  const handleEncrypt = () => {
    if (typeof selectedMethod === 'number' && message) {
      dispatch(encryptFile({ methodId: selectedMethod, message} ));
    }
  };

  return (
    <div>
      <h3>2. Выберите метод шифрования</h3>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Введите ваше секретное сообщение здесь..."
        rows={4}
        style={{ width: '100%', boxSizing: 'border-box', marginBottom: '10px' }}
      />
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
      <button 
        onClick={handleEncrypt} 
        disabled={selectedMethod === '' || !message || encryptionStatus === 'loading'}
      >
        {encryptionStatus === 'loading' ? 'Шифрование...' : 'Зашифровать'}
      </button>
      {encryptionStatus === 'failed' && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};