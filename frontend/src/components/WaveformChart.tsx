import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from 'chart.js';

// Регистрируем необходимые компоненты Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip);

interface WaveformChartProps {
  chartData: number[];
  label: string;
}

export const WaveformChart: React.FC<WaveformChartProps> = ({ chartData, label }) => {
  const options = {
    responsive: true,
    animation: {
        duration: 0 // Отключаем анимацию для производительности
    },
    plugins: {
      legend: {
        display: false, // Скрываем легенду
      },
      title: {
        display: true,
        text: label,
      },
    },
    scales: {
        x: {
            ticks: { display: false } // Скрываем метки по оси X
        },
        y: {
            min: -1, // Аудио с плавающей точкой обычно в диапазоне -1 до 1
            max: 1,
        }
    }
  };

  const data = {
    // Создаем метки для оси X, но не отображаем их
    labels: chartData.map((_, index) => index),
    datasets: [
      {
        label: 'Amplitude',
        data: chartData,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderWidth: 1,
        pointRadius: 0, // Убираем точки
      },
    ],
  };

  return <Line options={options} data={data} />;
};