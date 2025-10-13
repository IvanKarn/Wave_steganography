import os
import hashlib
from scipy.io import wavfile
import settings


class FileStorage:
    def __init__(self, storage_directory=settings.STORAGE_DIR):
        if not storage_directory:
            raise ValueError('SECRET_KEY or STORAGE_DIR was not set')
        self.storage_directory = storage_directory
        os.makedirs(self.storage_directory, exist_ok=True)

    def _generate_file_hash(self, file_bytes):
        """Генерирует хэш SHA256 для переданного файла в байтах."""
        return hashlib.sha256(file_bytes).hexdigest()

    def save_file(self, file_bytes):
        """Сохраняет файл и возвращает его хэш."""
        file_hash = self._generate_file_hash(file_bytes)
        file_path = os.path.join(self.storage_directory, file_hash)
        with open(file_path, 'wb') as file:
            file.write(file_bytes)
        return file_hash

    def save_audio(self, samplerate, data):
        """Сохраняет файл и возвращает его хэш."""
        file_hash = self._generate_file_hash(data.tobytes())
        file_path = os.path.join(self.storage_directory, file_hash)
        wavfile.write(file_path, samplerate, data)
        return file_hash

    def get_file_path(self, file_hash):
        """Возвращает путь к файлу по его хэшу."""
        return os.path.join(self.storage_directory, file_hash)

    def delete_file(self, file_hash):
        """Удаляет файл по его хэшу."""
        file_path = self.get_file_path(file_hash)
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
        return False
