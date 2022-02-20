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
                <AppInput name={`value-${question.id}`} variant='outlined' type='number' css={inputCss} />
              )}
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
            {questionIndex === questionsData.length - 1 && (
              <div>
                <FormGroup
                  sx={{ display: 'flex', flexDirection: 'row', marginTop: 2, justifyContent: 'center', alignItems: 'center' }}
                >
                  <Checkbox id='gdpr' />
                  <label htmlFor='gdpr' style={{ cursor: 'pointer' }}>
                    Odesláním souhlasím s
                    <Button
                      sx={{ minWidth: 0, padding: 0, margin: 0, marginBottom: 0.1, marginLeft: 0.7 }}
                      onClick={() => setIsModalOpen(true)}
                    >
                      GDPR
                    </Button>
                  </label>
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
            {questionIndex === questionsData.length - 1 && (
              <div>
                <FormGroup
                  sx={{ display: 'flex', flexDirection: 'row', marginTop: 2, justifyContent: 'center', alignItems: 'center' }}
                >
                  <Checkbox id='gdpr' />
                  <label htmlFor='gdpr' style={{ cursor: 'pointer' }}>
                    Odesláním souhlasím s
                    <Button
                      sx={{ minWidth: 0, padding: 0, margin: 0, marginBottom: 0.1, marginLeft: 0.7 }}
                      onClick={() => setIsModalOpen(true)}
                    >
                      GDPR
                    </Button>
                  </label>
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
                  <label htmlFor='gdpr' style={{ cursor: 'pointer' }}>
                    Odesláním souhlasím s
                    <Button
                      sx={{ minWidth: 0, padding: 0, margin: 0, marginBottom: 0.1, marginLeft: 0.7 }}
                      onClick={() => setIsModalOpen(true)}
                    >
                      GDPR
                    </Button>
                  </label>
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
        <Box sx={{ ...style, overflow: 'scroll', height: 600 }}>
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Zásady ochrany osobních údajů
          </Typography>

          <Typography id='modal-modal-title' variant='h6' component='h2'>
            I.
          </Typography>
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            Základní ustanovení Správcem osobních údajů podle čl. 4 bod 7 nařízení Evropského parlamentu a Rady (EU) 2016/679 o
            ochraně fyzických osob v souvislosti se zpracováním osobních údajů a o volném pohybu těchto údajů (dále jen: „GDPR”)
            je ……. IČ ……se sídlem….. (dále jen: „správce“). Kontaktní údaje správce jsou adresa: email: telefon: Osobními údaji se
            rozumí veškeré informace o identifikované nebo identifikovatelné fyzické osobě; identifikovatelnou fyzickou osobou je
            fyzická osoba, kterou lze přímo či nepřímo identifikovat, zejména odkazem na určitý identifikátor, například jméno,
            identifikační číslo, lokační údaje, síťový identifikátor nebo na jeden či více zvláštních prvků fyzické, fyziologické,
            genetické, psychické, ekonomické, kulturní nebo společenské identity této fyzické osoby. Správce nejmenoval / jmenoval
            pověřence pro ochranu osobních údajů. Kontaktními údaji pověřence jsou:
          </Typography>

          <Typography id='modal-modal-title' variant='h6' component='h2'>
            II.
          </Typography>
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            Zdroje a kategorie zpracovávaných osobních údajů Správce zpracovává osobní údaje, které jste mu poskytl/a nebo osobní
            údaje, které správce získal na základě plnění Vaší objednávky. Správce zpracovává Vaše identifikační a kontaktní údaje
            a údaje nezbytné pro plnění smlouvy.
          </Typography>

          <Typography id='modal-modal-title' variant='h6' component='h2'>
            III.
          </Typography>
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            Zákonný důvod a účel zpracování osobních údajů Zákonným důvodem zpracování osobních údajů je plnění smlouvy mezi Vámi
            a správcem podle čl. 6 odst. 1 písm. b) GDPR, oprávněný zájem správce na poskytování přímého marketingu (zejména pro
            zasílání obchodních sdělení a newsletterů) podle čl. 6 odst. 1 písm. f) GDPR, Váš souhlas se zpracováním pro účely
            poskytování přímého marketingu (zejména pro zasílání obchodních sdělení a newsletterů) podle čl. 6 odst. 1 písm. a)
            GDPR ve spojení s § 7 odst. 2 zákona č. 480/2004 Sb., o některých službách informační společnosti v případě, že
            nedošlo k objednávce zboží nebo služby. Účelem zpracování osobních údajů je vyřízení Vaší objednávky a výkon práv a
            povinností vyplývajících ze smluvního vztahu mezi Vámi a správcem; při objednávce jsou vyžadovány osobní údaje, které
            jsou nutné pro úspěšné vyřízení objednávky (jméno a adresa, kontakt), poskytnutí osobních údajů je nutným požadavkem
            pro uzavření a plnění smlouvy, bez poskytnutí osobních údajů není možné smlouvu uzavřít či jí ze strany správce plnit,
            zasílání obchodních sdělení a činění dalších marketingových aktivit. Ze strany správce nedochází / dochází
            k automatickému individuálnímu rozhodování ve smyslu čl. 22 GDPR. S takovým zpracováním jste poskytl/a svůj výslovný
            souhlas.
          </Typography>

          <Typography id='modal-modal-title' variant='h6' component='h2'>
            IV.
          </Typography>
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            Doba uchovávání údajů Správce uchovává osobní údaje po dobu nezbytnou k výkonu práv a povinností vyplývajících ze
            smluvního vztahu mezi Vámi a správcem a uplatňování nároků z těchto smluvních vztahů (po dobu 15 let od ukončení
            smluvního vztahu). po dobu, než je odvolán souhlas se zpracováním osobních údajů pro účely marketingu, nejdéle …. let,
            jsou-li osobní údaje zpracovávány na základě souhlasu. Po uplynutí doby uchovávání osobních údajů správce osobní údaje
            vymaže.
          </Typography>

          <Typography id='modal-modal-title' variant='h6' component='h2'>
            V.
          </Typography>
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            Příjemci osobních údajů (subdodavatelé správce) Příjemci osobních údajů jsou osoby podílející se na dodání zboží /
            služeb / realizaci plateb na základě smlouvy, podílející se na zajištění provozu služeb, zajišťující marketingové
            služby. Správce nemá / má v úmyslu předat osobní údaje do třetí země (do země mimo EU) nebo mezinárodní organizaci.
            Příjemci osobních údajů ve třetích zemích jsou poskytovatelé mailingových služeb / cloudových služeb.
          </Typography>

          <Typography id='modal-modal-title' variant='h6' component='h2'>
            VI.
          </Typography>
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            Vaše práva Za podmínek stanovených v GDPR máte právo na přístup ke svým osobním údajům dle čl. 15 GDPR, právo opravu
            osobních údajů dle čl. 16 GDPR, popřípadě omezení zpracování dle čl. 18 GDPR. právo na výmaz osobních údajů dle čl. 17
            GDPR. právo vznést námitku proti zpracování dle čl. 21 GDPR a právo na přenositelnost údajů dle čl. 20 GDPR. právo
            odvolat souhlas se zpracováním písemně nebo elektronicky na adresu nebo email správce uvedený v čl. III těchto
            podmínek. Dále máte právo podat stížnost u Úřadu pro ochranu osobních údajů v případě, že se domníváte, že bylo
            porušeno Vaší právo na ochranu osobních údajů.
          </Typography>

          <Typography id='modal-modal-title' variant='h6' component='h2'>
            VII.
          </Typography>
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            Podmínky zabezpečení osobních údajů Správce prohlašuje, že přijal veškerá vhodná technická a organizační opatření
            k zabezpečení osobních údajů. Správce přijal technická opatření k zabezpečení datových úložišť a úložišť osobních
            údajů v listinné podobě, zejména … Správce prohlašuje, že k osobním údajům mají přístup pouze jím pověřené osoby.{' '}
          </Typography>

          <Typography id='modal-modal-title' variant='h6' component='h2'>
            VIII.
          </Typography>
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            Závěrečná ustanovení Odesláním objednávky z internetového objednávkového formuláře potvrzujete, že jste seznámen/a s
            podmínkami ochrany osobních údajů a že je v celém rozsahu přijímáte. S těmito podmínkami souhlasíte zaškrtnutím
            souhlasu prostřednictvím internetového formuláře. Zaškrtnutím souhlasu potvrzujete, že jste seznámen/a s podmínkami
            ochrany osobních údajů a že je v celém rozsahu přijímáte. Správce je oprávněn tyto podmínky změnit. Novou verzi
            podmínek ochrany osobních údajů zveřejní na svých internetových stránkách, případně Vám zašle novou verzi těchto
            podmínek na e-mailovou adresu, kterou jste správci poskytl/a. Tyto podmínky nabývají účinnosti dnem 25.5.2018.{' '}
          </Typography>
          <Button onClick={() => setIsModalOpen(false)} sx={{ marginTop: 3 }} variant='contained'>
            Zavřít
          </Button>
        </Box>
      </Modal>
    </>
  );
};
