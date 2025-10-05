import React, { useRef, useEffect } from 'react';

interface SpectrogramChartProps {
  chartData: number[][]; // Двумерный массив
  label: string;
}

export const SpectrogramChart: React.FC<SpectrogramChartProps> = ({ chartData, label }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !chartData || chartData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const numTimeSteps = chartData.length;
    const numFreqBins = chartData[0].length;

    // Находим максимальное значение для нормализации цвета
    let maxVal = 0;
    for (let i = 0; i < numTimeSteps; i++) {
        for (let j = 0; j < numFreqBins; j++) {
            if(chartData[i][j] > maxVal) maxVal = chartData[i][j];
        }
    }

    // Определяем размер каждого "пикселя" на канвасе
    const cellWidth = canvas.width / numTimeSteps;
    const cellHeight = canvas.height / numFreqBins;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Рисуем спектрограмму
    for (let i = 0; i < numTimeSteps; i++) {
      for (let j = 0; j < numFreqBins; j++) {
        const value = chartData[i][j];
        // Преобразуем значение в оттенок серого
        const colorValue = Math.floor((value / maxVal) * 255);
        ctx.fillStyle = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
        
        // Рисуем прямоугольник. Ось Y инвертирована.
        ctx.fillRect(i * cellWidth, canvas.height - (j + 1) * cellHeight, cellWidth, cellHeight);
      }
    }
  }, [chartData]);

  return (
    <div>
      <h4>{label}</h4>
      {/* Задаем фиксированный размер для канваса, его можно адаптировать через CSS */}
      <canvas ref={canvasRef} width="400" height="250" style={{ border: '1px solid black' }} />
    </div>
  );
};