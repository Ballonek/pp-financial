/** @jsxImportSource @emotion/react */
import { Button, TextField } from '@mui/material';
import { FC, useMemo } from 'react';
import { questionCss, activeQuestionCss, selectAnswersCss, openAnswersCss, questionHeaderCss, longTextCss, inputCss } from './styles';
import { useQuestions } from '../hooks/useQuestions';
import { QuestionProps, QuestionType } from './types';
import { AppInput } from './AppInput';
import { useFormContext } from 'react-hook-form';

export const Question: FC<QuestionProps> = ({ question, questionIndex }) => {
  const { activeQuestion, nextActiveQuestion } = useQuestions();
  const { getValues, setError } = useFormContext();

  const questionMemo = useMemo(() => {
    switch (question.type) {
      case QuestionType.OPEN:
        return (
          <>
            <div css={questionHeaderCss}>
              <h2>{question.text}</h2>
            </div>
            <div css={openAnswersCss}>
              {question?.answerType === 'number' && <AppInput name={`value-${question.id}`} variant='outlined' type='number' css={inputCss} />}
              {question?.answerType === 'longString' && (
                <AppInput
                  variant='outlined'
                  type='text'
                  sx={{ width: 400 }}
                  placeholder='Odpověď'
                  multiline
                  name={`value-${question.id}`}
                />
              )}
              {question?.answerType === 'string' && (
                <AppInput
                  variant='outlined'
                  type='text'
                  css={longTextCss}
                  sx={{ width: 300 }}
                  placeholder='Odpověď'
                  name={`value-${question.id}`}
                />
              )}
              <Button
                variant='contained'
                sx={{ marginTop: 2, width: 200 }}
                onClick={() => {
                  if (!getValues(`value-${question.id}`)) {
                    setError(`value-${question.id}`, { message: 'Musí být vyplněno' });
                  } else {
                    nextActiveQuestion(`${question.text} - ${getValues(`value-${question.id}`)}`);
                  }
                }}
              >
                Pokračovat
              </Button>
            </div>
          </>
        );
      case QuestionType.SCALE:
        return (
          <>
            <div css={questionHeaderCss}>
              <h2>{question.text}</h2>
            </div>
            <div css={selectAnswersCss}>
              {question?.scale &&
                Array.from({ length: question.scale }, (_, i) => i + 1).map((value) => (
                  <Button
                    variant='outlined'
                    sx={{ margin: 1 }}
                    key={value}
                    onClick={() => nextActiveQuestion(`${question.text} - ${value}`)}
                  >
                    {value}
                  </Button>
                ))}
            </div>
          </>
        );
      case QuestionType.SELECT:
        return (
          <>
            <div css={questionHeaderCss}>
              <h2>{question.text}</h2>
            </div>
            <div css={selectAnswersCss}>
              {question?.answers?.length &&
                question.answers.map((answer) => (
                  <Button
                    variant='contained'
                    key={answer.id}
                    sx={{ margin: 1 }}
                    onClick={() => nextActiveQuestion(`${question.text} - ${answer.text}`)}
                  >
                    {answer.text}
                  </Button>
                ))}
            </div>
          </>
        );
      default:
        return <></>;
    }
  }, [
    question.type,
    question.text,
    question?.answerType,
    question.id,
    question.scale,
    question.answers,
    getValues,
    setError,
    nextActiveQuestion,
  ]);

  return <div css={[questionCss, activeQuestion === questionIndex + 1 && activeQuestionCss]}>{questionMemo}</div>;
};
