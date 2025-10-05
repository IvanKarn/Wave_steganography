import { useAppSelector } from '../store/hooks';

export const DecryptionResult = () => {
  const { decryptedMessage } = useAppSelector((state) => state.app);

  return (
    <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc' }}>
      <h3>Извлеченное сообщение:</h3>
      {decryptedMessage ? (
        <p style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>{decryptedMessage}</p>
      ) : (
        <p>Сообщение не найдено или оно пустое.</p>
      )}
    </div>
  );
};