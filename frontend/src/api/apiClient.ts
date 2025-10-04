import axios from 'axios';

const apiClient = axios.create({
  // Укажите URL, по которому будет работать ваш backend
  // В режиме разработки это может быть 'http://localhost:8000/api'
  baseURL: '/api', // Используем относительный путь для простоты
});

export default apiClient;