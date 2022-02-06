import axios from 'axios';

export const baseApiUrl = 'http://localhost:1337';

export const axiosInstance = axios.create({ baseURL: baseApiUrl });
