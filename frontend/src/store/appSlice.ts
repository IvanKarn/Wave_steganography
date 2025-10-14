import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import apiClient from '../api/apiClient';

// Типы для данных
interface EncryptionMethod {
  id: number;
  name: string;
}
interface WaveformResponse {
  waveform_data: number[];
}
interface SpectrogramResponse {
  spectrogram_data: number[][];
}

// Тип состояния
interface AppState {
  // Отслеживаем этапы процесса
  uploadStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  methodsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  encryptionStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  decryptionStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  downloadStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  
  // Данные
  encryptionMethods: EncryptionMethod[];
  originalWaveform: number[] | null;
  encryptedWaveform: number[] | null;
  originalSpectrogram: number[][] | null;
  encryptedSpectrogram: number[][] | null;
  decryptedMessage: string | null;

  // Ошибки
  error: string | null;
}

const initialState: AppState = {
  uploadStatus: 'idle',
  methodsStatus: 'idle',
  encryptionStatus: 'idle',
  decryptionStatus: 'idle',
  downloadStatus: 'idle',
  encryptionMethods: [],
  originalWaveform: null,
  encryptedWaveform: null,
  originalSpectrogram: null,
  encryptedSpectrogram: null,
  decryptedMessage: null,
  error: null,
};

// --- Асинхронные действия (Thunks) ---

export const uploadFile = createAsyncThunk('app/uploadFile', async (file: File, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append('file_bytes', file);
    await apiClient.post('/upload_file', formData);
    return true;
  } catch (err: any) {
    return rejectWithValue('Ошибка при загрузке файла.');
  }
});

export const fetchMethods = createAsyncThunk('app/fetchMethods', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get('/get_methods');
    const methodsArray = Object.entries(response.data).map(([id, name]) => ({
      id: Number(id),
      name: String(name),
    }));
    return methodsArray;
  } catch (err: any) {
    return rejectWithValue('Ошибка при получении методов.');
  }
});

export const encryptFile = createAsyncThunk(
  'app/encryptFile',
  async ({ methodId, message }: { methodId: number; message: string }, { rejectWithValue }) => {
    try {
      const requestBody = { id: methodId, data: message, params: {} };
      
      await apiClient.post('/encrypt', requestBody);
      return true;
    } catch (err: any) {
      return rejectWithValue('Ошибка при шифровании.');
    }
  }
);

export const decryptFile = createAsyncThunk(
  'app/decryptFile',
  async (methodId: number, { rejectWithValue }) => {
    try {
      const requestBody = { id: methodId, data: "", params: {} };
      const response = await apiClient.post<{ data: string }>('/decrypt', requestBody);
      // Ожидаем ответ вида { "data": "секретное сообщение" }
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue('Ошибка при извлечении данных.');
    }
  }
);

interface FetchChartDataArgs {
  isOriginal: boolean;
}

export const fetchWaveform = createAsyncThunk(
  'app/fetchWaveform',
  async ({ isOriginal }: FetchChartDataArgs, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<WaveformResponse>('/get_graph');
      return { data: response.data.waveform_data, isOriginal };
    } catch (err: any) {
      return rejectWithValue('Ошибка при получении данных волновой формы.');
    }
  }
);

export const fetchSpectrogram = createAsyncThunk(
  'app/fetchSpectrogram',
  async ({ isOriginal }: FetchChartDataArgs, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<SpectrogramResponse>('/get_spectrogramm');
      return { data: response.data.spectrogram_data, isOriginal };
    } catch (err: any) {
      return rejectWithValue('Ошибка при получении данных спектрограммы.');
    }
  }
);

// export const downloadResultFile = createAsyncThunk('app/downloadFile', async (_, { rejectWithValue }) => {
//   try {
//     const response = await apiClient.post('/download_file', {}, { responseType: 'blob' });
//     return response.data as Blob;
//   } catch (err: any) {
//     return rejectWithValue('Ошибка при скачивании файла.');
//   }
// });

// --- Срез (Slice) ---

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    resetState: () => initialState,
    setDownloadPending: (state) => {
      state.downloadStatus = 'loading';
      state.error = null;
    },
    setDownloadSuccess: (state) => {
      state.downloadStatus = 'succeeded';
    },
    setDownloadFailed: (state, action: PayloadAction<string>) => {
      state.downloadStatus = 'failed';
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Upload
    builder.addCase(uploadFile.pending, (state) => {
      Object.assign(state, initialState); // Полный сброс при новой загрузке
      state.uploadStatus = 'loading';
    });
    builder.addCase(uploadFile.fulfilled, (state) => {
      state.uploadStatus = 'succeeded';
    });
    builder.addCase(uploadFile.rejected, (state, action) => {
      state.uploadStatus = 'failed';
      state.error = action.payload as string;
    });

    // Methods
    builder.addCase(fetchMethods.pending, (state) => {
      state.methodsStatus = 'loading';
    });
    builder.addCase(fetchMethods.fulfilled, (state, action) => {
      state.methodsStatus = 'succeeded';
      state.encryptionMethods = action.payload;
    });
    builder.addCase(fetchMethods.rejected, (state, action) => {
      state.methodsStatus = 'failed';
      state.error = action.payload as string;
    });

    // Encrypt
    builder.addCase(encryptFile.pending, (state) => {
      state.encryptionStatus = 'loading';
    });
    builder.addCase(encryptFile.fulfilled, (state) => {
      state.encryptionStatus = 'succeeded';
    });
    builder.addCase(encryptFile.rejected, (state, action) => {
      state.encryptionStatus = 'failed';
      state.error = action.payload as string;
    });

    // Decrypt
    builder.addCase(decryptFile.pending, (state) => {
      state.decryptionStatus = 'loading';
      state.decryptedMessage = null; // Очищаем старое сообщение
      state.error = null;
    });
    builder.addCase(decryptFile.fulfilled, (state, action: PayloadAction<string>) => {
      state.decryptionStatus = 'succeeded';
      state.decryptedMessage = action.payload;
    });
    builder.addCase(decryptFile.rejected, (state, action) => {
      state.decryptionStatus = 'failed';
      state.error = action.payload as string;
    });
    
    // Waveform
    builder.addCase(fetchWaveform.fulfilled, (state, action) => {
        if (action.payload.isOriginal) {
            state.originalWaveform = action.payload.data;
        } else {
            state.encryptedWaveform = action.payload.data;
        }
    });

    // Spectrogram
    builder.addCase(fetchSpectrogram.fulfilled, (state, action) => {
        if (action.payload.isOriginal) {
            state.originalSpectrogram = action.payload.data;
        } else {
            state.encryptedSpectrogram = action.payload.data;
        }
    });
  },
});

export const { resetState, setDownloadPending, setDownloadSuccess, setDownloadFailed } = appSlice.actions;
export default appSlice.reducer;