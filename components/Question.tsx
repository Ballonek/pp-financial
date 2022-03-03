/** @jsxImportSource @emotion/react */
import { Button, Checkbox, FormControlLabel, FormGroup, Modal, TextField, Typography } from '@mui/material';
import { FC, useMemo, useState } from 'react';
import {
  questionCss,
  activeQuestionCss,
  selectAnswersCss,
  openAnswersCss,
  questionHeaderCss,
  longTextCss,
  inputCss,
  scaleAnswersCss,
  gdprCss,
} from './styles';
import { useQuestions } from '../hooks/useQuestions';
import { QuestionProps, QuestionType } from './types';
import { AppInput } from './AppInput';
import { useFormContext } from 'react-hook-form';
import { Box } from '@mui/system';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const Question: FC<QuestionProps> = ({ question, questionIndex }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { activeQuestion, nextActiveQuestion, questionsData } = useQuestions();
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
                    nextActiveQuestion(`${question.text} - ${getValues(`value-${question.id}`)}`);
                  }
                }}
              >
                Pokračovat
              </Button>
            </div>
            {questionIndex === questionsData.length - 1 && (
              <div>
                <FormGroup
                  sx={{ display: 'flex', flexDirection: 'row', marginTop: 2, justifyContent: 'center', alignItems: 'center' }}
                >
                  <Checkbox id='gdpr' />
                  <Button
                    component='label'
                    sx={{ minWidth: 0, padding: 0, margin: 0, marginBottom: 0.1, marginLeft: 0.7 }}
                    onClick={() => setIsModalOpen(true)}
                  >
                    <label htmlFor='gdpr' style={{ cursor: 'pointer' }} css={gdprCss}>
                      Odesláním souhlasím s GDPR
                    </label>
                  </Button>
                </FormGroup>
              </div>
            )}
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
                    onClick={() => nextActiveQuestion(`${question.text} - ${value}`)}
                  >
                    {value}
                  </Button>
                ))}
            </div>
            {questionIndex === questionsData.length - 1 && (
              <div>
                <FormGroup
                  sx={{ display: 'flex', flexDirection: 'row', marginTop: 2, justifyContent: 'center', alignItems: 'center' }}
                >
                  <Checkbox id='gdpr' />
                  <Button
                    component='label'
                    sx={{ minWidth: 0, padding: 0, margin: 0, marginBottom: 0.1, marginLeft: 0.7 }}
                    onClick={() => setIsModalOpen(true)}
                  >
                    <label htmlFor='gdpr' style={{ cursor: 'pointer' }} css={gdprCss}>
                      Odesláním souhlasím s GDPR
                    </label>
                  </Button>
                </FormGroup>
              </div>
            )}
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
            {questionIndex === questionsData.length - 1 && (
              <div>
                <FormGroup
                  sx={{ display: 'flex', flexDirection: 'row', marginTop: 2, justifyContent: 'center', alignItems: 'center' }}
                >
                  <Checkbox id='gdpr' />
                  <Button
                    sx={{ minWidth: 0, padding: 0, margin: 0, marginBottom: 0.1, marginLeft: 0.7 }}
                    onClick={() => setIsModalOpen(true)}
                    component='label'
                  >
                    <label htmlFor='gdpr' style={{ cursor: 'pointer' }} css={gdprCss}>
                      Odesláním souhlasím s GDPR
                    </label>
                  </Button>
                </FormGroup>
              </div>
            )}
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
    nextActiveQuestion,
  ]);

  return (
    <>
      <div css={[questionCss, activeQuestion === questionIndex + 1 && activeQuestionCss]}>{questionMemo}</div>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={{ ...style, overflow: 'scroll', height: 600, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
          <Typography id='modal-modal-title' textAlign='center' variant='h6' component='h2'>
            Chcete se domluvit? Je potřeba požádat o souhlas se zpracováním dat.
          </Typography>

          <Typography id='modal-modal-title' textAlign='center' variant='h6' component='h2'>
            *
          </Typography>
          <Typography id='modal-modal-description' textAlign='center' sx={{ mt: 2 }}>
            Abychom Vás mohli kontaktovat v případě, že úspěšně vyplníte dotazník. Veškerá data zpracováváme a uchováváme bezpečně
            dle zákona o Zpracování a ochraně osobních údajů č. 101/2000 Sb., a Nařízení Evropského parlamentu a Rady (EU)
            2016/679 (GDPR).
          </Typography>

          <Typography id='modal-modal-description' textAlign='center' sx={{ mt: 2 }}>
            Můžeme Vás také kontaktovat se zajímavou nabídkou obchodní spolupráce a to prostřednictvím elektronické pošty,
            telefonického hovoru nebo SMS zprávy. Zpracovatel je Investhy a.s., IČO: 08571465, se sídlem: Václavské náměstí 846/1,
            Nové Město, Praha 1, 110 00.
          </Typography>

          <Typography id='modal-modal-description' textAlign='center' sx={{ mt: 2 }}>
            Kdykoliv můžete požádat o smazání svých dat zaslanou žádostí na info@investhy.cz Ze zákona jsme tak povinní to
            zajistit.
          </Typography>

          <Typography id='modal-modal-description' textAlign='center' sx={{ mt: 2 }}>
            Zaškrtnutím dáváte najevo svůj dobrovolný souhlas.
          </Typography>

          <Button onClick={() => setIsModalOpen(false)} sx={{ marginTop: 3 }} variant='contained'>
            Zavřít
          </Button>
        </Box>
      </Modal>
    </>
  );
};
