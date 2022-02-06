/** @jsxImportSource @emotion/react */
import { FC } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useQuestions } from '../hooks/useQuestions';
import { Question } from './Question';
import { questionsContainerCss } from './styles';
import { QuestionsProps } from './types';

export const Questions: FC<QuestionsProps> = () => {
  const form = useForm();
  const { questionsData: questions } = useQuestions();

  return (
    <FormProvider {...form}>
      <div css={questionsContainerCss}>
        {questions.length > 0 &&
          questions.map((question, index) => <Question key={index} question={question} questionIndex={index} />)}
      </div>
    </FormProvider>
  );
};
