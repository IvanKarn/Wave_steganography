import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMethods, encryptFile } from '../store/appSlice';

export const MethodSelector = () => {
  const dispatch = useAppDispatch();
  const { cookie1, encryptionMethods, encryptionStatus, encryptionError } = useAppSelector((state) => state.app);
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null);

  // Загружаем методы, как только компонент появляется
  useEffect(() => {
    dispatch(fetchMethods());
  }, [dispatch]);
  
  // Устанавливаем метод по умолчанию
  useEffect(() => {
    if (encryptionMethods.length > 0) {
        setSelectedMethod(encryptionMethods[0].id);
    }
  }, [encryptionMethods])

  const handleEncrypt = () => {
    if (selectedMethod && cookie1) {
      dispatch(encryptFile({ method_id: selectedMethod, cookie1 }));
    }
  };

  return (
    <div>
      <h3>2. Выберите метод шифрования</h3>
      <select 
        onChange={(e) => setSelectedMethod(Number(e.target.value))}
        value={selectedMethod ?? ''}
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
      {encryptionStatus === 'failed' && <p style={{ color: 'red' }}>Ошибка: {encryptionError}</p>}
    </div>
  );
};