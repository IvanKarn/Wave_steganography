import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api', // Убедитесь, что это правильный префикс
  withCredentials: true, // Ключевая настройка для автоматической отправки cookie
});

export default apiClient;