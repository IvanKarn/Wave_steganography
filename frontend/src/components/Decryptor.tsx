import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { decryptFile } from '../store/appSlice';

export const Decryptor = () => {
  const dispatch = useAppDispatch();
  const { encryptionMethods, decryptionStatus, error } = useAppSelector((state) => state.app);
  const [selectedMethod, setSelectedMethod] = useState<number | ''>('');

  useEffect(() => {
    if (encryptionMethods.length > 0) {
      setSelectedMethod(encryptionMethods[0].id);
    }
  }, [encryptionMethods]);

  const handleDecrypt = () => {
    if (typeof selectedMethod === 'number') {
      dispatch(decryptFile(selectedMethod));
    }
  };

  return (
    <div>
      <h3>2. Выберите метод для извлечения данных</h3>
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
      <button onClick={handleDecrypt} disabled={selectedMethod === '' || decryptionStatus === 'loading'}>
        {decryptionStatus === 'loading' ? 'Извлечение...' : 'Извлечь сообщение'}
      </button>
      {decryptionStatus === 'failed' && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};