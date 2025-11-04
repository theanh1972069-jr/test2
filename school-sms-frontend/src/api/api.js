// src/api/api.js
import axios from 'axios';

// Đảm bảo Backend FastAPI đang chạy trên cổng này
const API_BASE_URL = 'http://localhost:8000'; 

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;