# Backend Service

Сервис на FastAPI для обработки аудиофайлов.

## Локальный запуск (для разработки)

### Требования
*   Python 3.11+
*   pip

### Инструкция
1.  **Создайте и активируйте виртуальное окружение:**
    ```sh
    python -m venv venv
    source venv/bin/activate  # Для Linux/macOS
    # venv\Scripts\activate    # Для Windows
    ```

2.  **Установите зависимости:**
    ```sh
    pip install -r requirements.txt
    ```

3.  **Запустите сервер для разработки:**
    ```sh
    uvicorn app.main:app --reload
    ```
    *   Флаг `--reload` автоматически перезапускает сервер при изменениях в коде.

Сервер будет доступен по адресу `http://localhost:8000`.
