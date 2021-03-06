import { FormProps, Question } from '../components/types';
import { axiosInstance } from './constants';

export const getQuestions = async () => {
  const response = await axiosInstance.get<{ questions: Question[] }>('questions');

  return response.data;
};
export const getQuestion = async (id: string) => await axiosInstance.get<{ question: Question }>(`questions/${id}`);

export const postQuestions = async (data: { questions: Question[]; token: string }) =>
  await axiosInstance.post<{ questions: Question[] }>('questions', data.questions, {
    headers: { Authorization: `Bearer ${data.token}` },
  });
export const postQuestion = async (data: { question: Question; token: string }) =>
  await axiosInstance.post<{ questions: Question[] }>(`questions/new`, data.question, {
    headers: { Authorization: `Bearer ${data.token}` },
  });
export const putQuestion = async (data: { question: Question; id: string; token: string }) =>
  await axiosInstance.post<{ questions: Question[] }>(`questions/${data.id}`, data.question, {
    headers: { Authorization: `Bearer ${data.token}` },
  });
export const deleteQuestion = async (data: { id: string; token: string }) =>
  await axiosInstance.delete<{ questions: Question[] }>(`questions/${data.id}`, {
    headers: { Authorization: `Bearer ${data.token}` },
  });

export const postBackgroundImage = async (data: { token: string; img: File }) => {
  const formData = new FormData();
  formData.append('backgroundImg', data.img);

  return await axiosInstance.post('dashboard/backgroundImg', formData, {
    headers: { Authorization: `Bearer ${data.token}`, 'Content-Type': 'multipart/form-data', Accept: 'application/json' },
  });
};

export const postAnswers = async (data: { answers: any }) => await axiosInstance.post('answers', data.answers);
export const getAnswers = async (data: { token: string }) =>
  await axiosInstance.get<any[]>('answers', {
    headers: { Authorization: `Bearer ${data.token}` },
  });

export const getDashboard = async () => await axiosInstance.get('dashboard');

export const putDashboard = async (data: { token: string; values: FormProps }) =>
  await axiosInstance.put('dashboard', data.values, {
    headers: { Authorization: `Bearer ${data.token}` },
  });
export const deleteAnswer = async (data: { id: string; token: string }) =>
  await axiosInstance.delete(`answers/${data.id}`, {
    headers: { Authorization: `Bearer ${data.token}` },
  });
