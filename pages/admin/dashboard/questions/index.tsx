import type { GetServerSideProps, NextPage } from 'next';
import Cookies from 'cookies';
import { axiosInstance } from '../../../../code/constants';
import { Typography } from '@mui/material';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Questionnaire } from '../../../../components/Questionnaire';
import { getQuestions } from '../../../../code/api';
import { Question } from '../../../../components/types';

type QuestionsServerProps = { questions: Question[] };

const Questions: NextPage<QuestionsServerProps> = ({ questions }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Typography paddingBottom={5}>Zde můžete změnit pořadí otázek</Typography>
      <Questionnaire questions={questions} />
    </DndProvider>
  );
};

export const getServerSideProps: GetServerSideProps<QuestionsServerProps> = async ({ req, res }) => {
  const cookies = new Cookies(req, res);

  const token = cookies.get('token');

  const { data: user } = await axiosInstance.get('admin', { headers: { Authorization: `Bearer ${token}` } });

  if (!user) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  const questionsData = await getQuestions();

  return {
    props: {
      questions: questionsData.questions,
    },
  };
};

export default Questions;
