/** @jsxImportSource @emotion/react */
import { Button } from '@mui/material';
import { FC, useMemo } from 'react';
import {
  questionCss,
  activeQuestionCss,
  selectAnswersCss,
  openAnswersCss,
  questionHeaderCss,
  longTextCss,
  inputCss,
  scaleAnswersCss,
} from './styles';
import { useQuestions } from '../hooks/useQuestions';
import { QuestionProps, QuestionType } from './types';
import { AppInput } from './AppInput';
import { useFormContext } from 'react-hook-form';
import { AppCheckbox } from './AppCheckbox';

export const Question: FC<QuestionProps> = ({ question, questionIndex, submit }) => {
  const { activeQuestion, nextActiveQuestion, questionsData } = useQuestions();
  const { getValues, setError, handleSubmit } = useFormContext();

  console.log(activeQuestion === questionsData.length);
  const questionMemo = useMemo(() => {
    switch (question.type) {
      case QuestionType.OPEN:
        return (
          <>
            <div css={questionHeaderCss}>
              <h2>{question.text}</h2>
            </div>
            <div css={openAnswersCss}>
              {question?.answerType === 'number' && (
                <AppInput name={`value-${question.id}`} fullWidth variant='outlined' type='number' css={inputCss} />
              )}
              {question?.answerType === 'longString' && (
                <AppInput
                  variant='outlined'
                  type='text'
                  fullWidth
                  placeholder='Odpověď'
                  multiline
                  name={`value-${question.id}`}
                />
              )}
              {question?.answerType === 'string' && (
                <AppInput
                  variant='outlined'
                  type='text'
                  fullWidth
                  css={[longTextCss, inputCss]}
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
                    activeQuestion === questionsData.length
                      ? submit(`${question.text} - ${getValues(`value-${question.id}`)}`)
                      : nextActiveQuestion(`${question.text} - ${getValues(`value-${question.id}`)}`);
                  }
                }}
              >
                Pokračovat
              </Button>
            </div>
            {questionIndex === questionsData.length - 1 && <AppCheckbox />}
          </>
        );
      case QuestionType.SCALE:
        return (
          <>
            <div css={questionHeaderCss}>
              <h2>{question.text}</h2>
            </div>
            <div css={scaleAnswersCss}>
              {question?.scale &&
                Array.from({ length: question.scale }, (_, i) => i + 1).map((value) => (
                  <Button
                    variant='outlined'
                    sx={{ margin: 1 }}
                    key={value}
                    onClick={() =>
                      activeQuestion === questionsData.length
                        ? submit(`${question.text} - ${value}`)
                        : nextActiveQuestion(`${question.text} - ${value}`)
                    }
                  >
                    {value}
                  </Button>
                ))}
            </div>
            {questionIndex === questionsData.length - 1 && <AppCheckbox />}
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
                    onClick={() =>
                      activeQuestion === questionsData.length
                        ? submit(`${question.text} - ${answer.text}`)
                        : nextActiveQuestion(`${question.text} - ${answer.text}`)
                    }
                  >
                    {answer.text}
                  </Button>
                ))}
            </div>
            {questionIndex === questionsData.length - 1 && <AppCheckbox />}
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
    questionIndex,
    questionsData.length,
    getValues,
    setError,
    activeQuestion,
    submit,
    nextActiveQuestion,
  ]);

  return (
    <>
      <div css={[questionCss, activeQuestion === questionIndex + 1 && activeQuestionCss]}>{questionMemo}</div>
    </>
  );
};
