import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../api/apiClient';

interface EncryptionMethod {
    id: number;
    name: string;
}

// Описываем тип нашего состояния для TypeScript
interface AppState {
  cookie1: string | null;                                       // Переименовать?
  cookie2: string | null;                                       // Переименовать?
  encryptionMethods: EncryptionMethod[];
  uploadStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  uploadError: string | null;
  encryptionStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  encryptionError: string | null;
}

// Начальное состояние
const initialState: AppState = {
  cookie1: null,                                                // Переименовать?
  cookie2: null,                                                // Переименовать?
  encryptionMethods: [],
  uploadStatus: 'idle',
  uploadError:  null,
  encryptionStatus: 'idle',
  encryptionError: null,
};

// Создаем асинхронное действие (thunk) для загрузки файла
// Это будет обрабатывать наш POST-запрос на /upload_file
export const uploadFile = createAsyncThunk(
  'app/uploadFile',
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('audio_file', file);
      const response = await apiClient.post('/upload_file', formData);
      return response.data; // Ожидаем, что сервер вернет { "cookie1": "..." }
    } catch (err: any) {
      return rejectWithValue(err.response.data)
    }
  }
);

export const fetchMethods = createAsyncThunk('app/fetchMethods', async () => {
  const response = await apiClient.get('/get_methods');
  return response.data.methods;
});

export const encryptFile = createAsyncThunk(
  'app/encryptFile',
  async ({ method_id, cookie1 }: { method_id: number; cookie1: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(
        '/encrypt',
        { method_id },
        { headers: { 'X-File-Token': cookie1 } }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response.data)
    }
  }
)

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
      // --- Обработчики для uploadFile ---
      .addCase(uploadFile.pending, (state) => {
        state.uploadStatus = 'loading';
        // Сбрасываем все состояние при загрузке нового файла
        Object.assign(state, initialState); 
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.uploadStatus = 'succeeded';
        state.cookie1 = action.payload.cookie1;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.uploadStatus = 'failed';
        state.uploadError = (action.payload as any)?.message || 'Upload failed';
      })
      // --- Обработчики для fetchMethods ---
      .addCase(fetchMethods.fulfilled, (state, action) => {
        state.encryptionMethods = action.payload;
      })
      // --- Обработчики для encryptFile ---
      .addCase(encryptFile.pending, (state) => {
        state.encryptionStatus = 'loading';
        state.encryptionError = null;
      })
      .addCase(encryptFile.fulfilled, (state, action) => {
        state.encryptionStatus = 'succeeded';
        state.cookie2 = action.payload.cookie2;
      })
      .addCase(encryptFile.rejected, (state, action) => {
        state.encryptionStatus = 'failed';
        state.encryptionError = (action.payload as any)?.message || 'Encryption failed';
      });
  },
});

export const { resetState } = appSlice.actions;
export default appSlice.reducer;