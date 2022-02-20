import { useRouter } from 'next/router';
import { createContext, FC, useCallback, useContext, useState } from 'react';
import { useMutation } from 'react-query';
import { postAnswers } from '../code/api';
import { Question } from '../components/types';
import { QuestionsProviderProps } from './types';

export const QuestionsContext = createContext<{
  activeQuestion: number;
  nextActiveQuestion: (answer: string) => void;
  questionsData: Question[];
  back: () => void;
}>({
  activeQuestion: 0,
  nextActiveQuestion: (answer) => {},
  questionsData: [],
  back: () => {},
});

export const useQuestionsManager = (questions: Question[]) => {
  const { mutate } = useMutation(postAnswers);
  const router = useRouter();
  const [activeQuestion, setActiveQuestion] = useState(1);
  const [answers, setAnswers] = useState<string[]>([]);

  const nextActiveQuestion = useCallback(
    (answer: string) => {
      if (activeQuestion <= questions.length - 1) {
        setActiveQuestion((prev) => prev + 1);
        setAnswers((previousAnswers) => [...previousAnswers, answer]);
      } else {
        setAnswers((previousAnswers) => {
          const newAnswers = [...previousAnswers, answer];
          mutate(
            { answers: [...previousAnswers, answer] },
            {
              onSuccess: () => {
                router.push('/dekujeme');
              },
            }
          );
          return newAnswers;
        });
      }
    },
    [activeQuestion, mutate, questions.length, router]
  );

  const back = useCallback(() => {
    if (activeQuestion > 1) {
      setActiveQuestion((prev) => (prev -= 1));
    }
  }, [activeQuestion]);

  return { activeQuestion, nextActiveQuestion, questionsData: questions, answers, back };
};

export const QuestionsProvider: FC<QuestionsProviderProps> = ({ children, questions }) => {
  const values = useQuestionsManager(questions);

  return <QuestionsContext.Provider value={values}>{children}</QuestionsContext.Provider>;
};

export const useQuestions = () => {
  const values = useContext(QuestionsContext);

  return { ...values };
};
