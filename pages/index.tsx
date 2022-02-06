import { Button } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { axiosInstance, baseApiUrl } from '../code/constants';
import { Questions } from '../components/Questions';
import { Question, QuestionType } from '../components/types';
import { QuestionsProvider } from '../hooks/useQuestions';
import styles from '../styles/Home.module.css';

type ServerImg = {
  data: {
    attributes: {
      name: string;
      alternativeText: string;
      url: string;
      [key: string]: any;
    };
  };
  createdAt: string;
  updatedAt: string;
  id: number;
};

type HomeServerProps = {
  layout: {
    backgroundImage: ServerImg;
    id: number;
    createdAt: string;
    updatedAt: string;
    welcomeText: string;
  };
};
const questions: Question[] = [
  {
    type: QuestionType.SELECT,
    text: 'Máte maturitu?',
    order: 1,
    id: 1,
    answers: [
      { id: 1, text: 'ANO' },
      { id: 2, text: 'NE' },
    ],
  },
  { type: QuestionType.OPEN, text: 'Kolik vám je let?', order: 2, id: 2, answerType: 'number' },
  {
    type: QuestionType.OPEN,
    text: 'Co Vám říkají tyto výrazy: CFD, OCP, SmartStocks?',
    order: 3,
    id: 3,
    answerType: 'longString',
  },
  { type: QuestionType.SCALE, text: 'Nejvíce mě baví začínat nové obchody', order: 4, id: 4, scale: 10 },
  { type: QuestionType.SCALE, text: 'Jsem samostatný', order: 5, id: 5, scale: 10 },
  {
    type: QuestionType.SELECT,
    text: 'Jak dlouho pracuji v obchodě',
    order: 6,
    id: 6,
    answers: [
      { id: 3, text: '0 - 1 rok' },
      { id: 4, text: '1 - 3 roky' },
      { id: 5, text: '3 a více let' },
    ],
  },
  { type: QuestionType.SCALE, text: 'Je důležitá pro mě vysoká provize', order: 7, id: 7, scale: 10 },
  {
    type: QuestionType.OPEN,
    text: 'Zavoláte potenciálním klientovi a on vám řekne pošlete mi to na email jak byste zvládl tuhle námitku ?',
    order: 8,
    id: 8,
    answerType: 'longString',
  },
  {
    type: QuestionType.SCALE,
    text: 'Když mám kolem sebe tým který mě podpoří podávám lepší výsledky ?',
    order: 9,
    id: 9,
    scale: 10,
  },
];

const layout = {
  welcomeText:
    'Průměrní lidé všechno začnou, ale nic nedokončí. Pokud se rozhodnete test začít, ale nedokončíte jej, tak Vám to dává zrcadlo, že věci nedotahujete do konce.',
};

const Home: NextPage<HomeServerProps> = () => {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <QuestionsProvider questions={questions}>
      <div className={styles.container}>
        <Head>
          <title>PP Financial</title>
          <meta name='description' content='Generated by create next app' />
          <link rel='icon' href='/favicon.ico' />
        </Head>
        <main style={{ backgroundImage: `url(/backgroundImage.jpeg)` }} className={styles.main}>
          <div className={styles.mainCover} />
          <div className={styles.content}>
            {!isStarted ? (
              <>
                <div className={styles.welcome}>
                  <h2 className={styles.welcomeText}>{layout.welcomeText}</h2>
                </div>
                <div>
                  <Button onClick={() => setIsStarted(true)} className={styles.welcomeBtn} variant='contained'>
                    Spusť test
                  </Button>
                </div>
              </>
            ) : (
              <Questions />
            )}
          </div>
        </main>
      </div>
    </QuestionsProvider>
  );
};

// export const getServerSideProps = async () => {
//   try {
//     const response = await axiosInstance.get('api/main-layout?populate=*');

//     const { data } = response.data;

//     return {
//       props: {
//         layout: { id: data.id, ...data.attributes },
//       },
//     };
//   } catch (error) {
//     return {
//       props: {
//         layout: null,
//       },
//     };
//   }
// };

export default Home;
