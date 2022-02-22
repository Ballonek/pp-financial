import axios from 'axios';

export const baseApiUrl = process.env.NEXT_PUBLIC_API || 'http://localhost:3000/api';

export const axiosInstance = axios.create({ baseURL: baseApiUrl });
