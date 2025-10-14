import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api', // Префикс для доступа к эндпоинтам
  withCredentials: true, // Ключевая настройка для автоматической отправки cookie
});

export default apiClient;