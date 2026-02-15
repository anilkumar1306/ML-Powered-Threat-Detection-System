import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 300000, // 5 minutes for large file uploads
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response || error.message);
        return Promise.reject(error);
    }
);

export interface UploadResponse {
    total_rows: number;
    benign_count: number;
    attack_count: number;
    anomaly_count: number;
    results: PredictionResult[];
}

export interface PredictionResult {
    row_id: number;
    prediction: string;
    confidence: number;
    anomaly_flag: boolean;
}

export interface ModelInfo {
    name: string;
    description: string;
}

export const apiService = {
    getHealth: async () => {
        const response = await api.get('/health');
        return response.data;
    },

    getModels: async () => {
        const response = await api.get('/models');
        // Assuming the backend returns a list of strings or objects. 
        // Adjusting based on user prompt requirements which list specific models.
        return response.data;
    },

    uploadFile: async (file: File, model: string, onUploadProgress?: (progressEvent: any) => void) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('model', model);

        const response = await api.post<UploadResponse>('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress,
        });
        return response.data;
    },

    downloadResults: async (fileId: string) => {
        const response = await api.get(`/download/${fileId}`, {
            responseType: 'blob',
        });
        return response.data;
    },
};

export default apiService;
