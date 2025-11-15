from processor.processor import Processor
from scipy.io import wavfile
from storage import FileStorage
import numpy as np
from abc import ABC, abstractmethod


class SpreadSpectrum(Processor):
    def __init__(self):
        super().__init__()
        self.storage = FileStorage()
        self.eof = bin(0xFFDEADFF)[2:]
        self.psp_seed = 0xDEADBEEF
        self.psp_length = 1024

    def _generate_psp(self, length):
        """Генерация псевдослучайной последовательности"""
        np.random.seed(self.psp_seed)
        return np.random.choice([-1, 1], size=length)

    def _string_to_bits(self, text):
        """Преобразование строки в битовую последовательность с поддержкой Unicode"""
        # Преобразуем текст в байты с использованием UTF-8
        byte_data = text.encode('utf-8')
        # Преобразуем байты в битовую строку
        bits = ''.join(format(byte, '08b') for byte in byte_data)
        return bits

    def _bits_to_string(self, bits):
        """Преобразование битовой последовательности в строку с поддержкой Unicode"""
        
        # Дополняем до кратного 8
        padding = 8 - (len(bits) % 8)
        if padding != 8:
            bits += '0' * padding
        
        # Преобразуем биты в байты
        byte_array = bytearray()
        for i in range(0, len(bits), 8):
            byte_bits = bits[i:i+8]
            if len(byte_bits) == 8:
                byte_val = int(byte_bits, 2)
                byte_array.append(byte_val)
        
        # Декодируем байты в строку с использованием UTF-8
        return byte_array.decode('utf-8', errors='replace')

    def encode(self, path, data, spread_factor=100, gain=0.02):
        """
        Кодирование данных методом расширения спектра
        """
        sample_rate, samples = wavfile.read(path)
        
        # Сохраняем исходный тип данных
        original_dtype = samples.dtype
        
        # Преобразование данных в биты
        if isinstance(data, bytes):
            data_str = data.decode('utf-8')
        else:
            data_str = data
            
        data_bits = self._string_to_bits(data_str)
        data_bits += self.eof
        
        
        # Преобразуем в моно если нужно
        if samples.ndim == 2:
            samples = samples[:, 0]  # Берем только левый канал
        
        # Нормализация в float64 для точности
        if original_dtype == np.int16:
            samples_float = samples.astype(np.float64) / 32768.0
            max_val = 32768.0
        elif original_dtype == np.int32:
            samples_float = samples.astype(np.float64) / 2147483648.0
            max_val = 2147483648.0
        else:
            # Если исходный формат уже float, все равно нормализуем к [-1, 1]
            samples_float = samples.astype(np.float64)
            if samples_float.max() > 1.0 or samples_float.min() < -1.0:
                samples_float = np.clip(samples_float, -1.0, 1.0)
            max_val = 1.0
        
        # Проверка размера
        required_samples = len(data_bits) * spread_factor
        if required_samples > len(samples_float):
            raise ValueError(f"Недостаточно samples. Нужно: {required_samples}, есть: {len(samples_float)}")
        
        # Генерация ПСП
        psp = self._generate_psp(self.psp_length)
        
        # Кодирование
        modified = samples_float.copy()
        bit_index = 0
        
        for bit in data_bits:
            for i in range(spread_factor):
                if bit_index >= len(samples_float):
                    break
                    
                psp_val = psp[bit_index % len(psp)]
                if bit == '1':
                    modified[bit_index] += gain * psp_val
                else:
                    modified[bit_index] -= gain * psp_val
                    
                bit_index += 1
        
        # Денормализация обратно в исходный целочисленный формат
        if original_dtype == np.int16:
            modified = np.clip(modified * 32768.0, -32768, 32767).astype(np.int16)
        elif original_dtype == np.int32:
            modified = np.clip(modified * 2147483648.0, -2147483648, 2147483647).astype(np.int32)
        else:
            # Если исходный был float, сохраняем как int16 для совместимости
            modified = np.clip(modified * 32768.0, -32768, 32767).astype(np.int16)
        
        res = self.storage.save_audio(sample_rate, modified)
        return res

    def decode(self, path, spread_factor=100, gain=0.02):
        """
        Декодирование данных методом расширения спектра
        """
        sample_rate, samples = wavfile.read(path)
        
        # Преобразуем в моно
        if samples.ndim == 2:
            samples = samples[:, 0]
        
        # Нормализация в float
        if samples.dtype == np.int16:
            samples_float = samples.astype(np.float64) / 32768.0
        elif samples.dtype == np.int32:
            samples_float = samples.astype(np.float64) / 2147483648.0
        else:
            samples_float = samples.astype(np.float64)
            # Если значения выходят за пределы [-1, 1], нормализуем
            if samples_float.max() > 1.0 or samples_float.min() < -1.0:
                samples_float = np.clip(samples_float, -1.0, 1.0)
        
        # Генерация ПСП
        psp = self._generate_psp(self.psp_length)
        
        # Декодирование
        decoded_bits = []
        sample_index = 0
        
        # Декодируем максимум 10000 бит
        max_bits = 10000
        
        for bit_num in range(max_bits):
            if sample_index + spread_factor > len(samples_float):
                break
                
            correlation = 0.0
            for i in range(spread_factor):
                idx = sample_index + i
                psp_idx = idx % len(psp)
                correlation += samples_float[idx] * psp[psp_idx]
            
            # Нормализуем корреляцию
            correlation /= spread_factor
            
            # Определяем бит
            if correlation > 0:
                decoded_bits.append('1')
            else:
                decoded_bits.append('0')
                
            sample_index += spread_factor
        
        bit_string = ''.join(decoded_bits)
        
        # Поиск EOF
        eof_pos = bit_string.find(self.eof)
        
        if eof_pos == -1:
            # EOF не найден, возвращаем всё что есть
            message_bits = bit_string
        else:
            message_bits = bit_string[:eof_pos]
        
        # Преобразуем биты в текст
        result = self._bits_to_string(message_bits)
        return result