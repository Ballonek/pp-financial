import axios from 'axios';

export const baseApiUrl = 'http://localhost:3000/api';

export const axiosInstance = axios.create({ baseURL: baseApiUrl });
