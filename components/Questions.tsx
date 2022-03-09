/** @jsxImportSource @emotion/react */
import { ArrowBack, BackspaceOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { FC } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useQuestions } from '../hooks/useQuestions';
import { Question } from './Question';
import { questionsContainerCss } from './styles';
import { QuestionsProps } from './types';

export const Questions: FC<QuestionsProps> = () => {
  const form = useForm();
  const { questionsData: questions, back, activeQuestion, nextActiveQuestion } = useQuestions();

  const submit = (v: string) => {
    if (!form.getValues('gdpr')) {
      console.log('No gdpr');
      return;
    }

    nextActiveQuestion(v);
  };

  return (
    <FormProvider {...form}>
      {activeQuestion > 1 && (
        <IconButton sx={{ position: 'absolute', left: 20, zIndex: 1000, top: 20 }} color='primary'>
          <ArrowBack onClick={back} fontSize='large'>
            back
          </ArrowBack>
        </IconButton>
      )}
      <form css={questionsContainerCss}>
        {questions.length > 0 &&
          questions.map((question, index) => <Question submit={submit} key={index} question={question} questionIndex={index} />)}
      </form>
    </FormProvider>
  );
};
