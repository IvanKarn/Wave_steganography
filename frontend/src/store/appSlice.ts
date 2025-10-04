import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/apiClient';

// Описываем тип нашего состояния для TypeScript
interface AppState {
  cookie1: string | null;                                       // Переименовать?
  cookie2: string | null;                                       // Переименовать?
  encryptionMethods: Array<{ id: number; name: string }>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Начальное состояние
const initialState: AppState = {
  cookie1: null,                                                // Переименовать?
  cookie2: null,                                                // Переименовать?
  encryptionMethods: [],
  status: 'idle',
  error: null,
};

// Создаем асинхронное действие (thunk) для загрузки файла
// Это будет обрабатывать наш POST-запрос на /upload_file
export const uploadFile = createAsyncThunk(
  'app/uploadFile',
  async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/upload_file', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data; // Ожидаем, что сервер вернет { "cookie1": "..." }
  }
);

// Создаем сам срез
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Здесь можно добавлять обычные (синхронные) действия
    resetState: () => initialState,
  },
  // Здесь мы обрабатываем состояния асинхронных действий
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cookie1 = action.payload.cookie1; // Сохраняем полученный cookie1
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export const { resetState } = appSlice.actions;
export default appSlice.reducer;