import { Button } from '@mui/material';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { getQuestions } from '../code/api';
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
  questions: Question[];
};

const layout = {
  welcomeText:
    'Průměrní lidé všechno začnou, ale nic nedokončí. Pokud se rozhodnete test začít, ale nedokončíte jej, tak Vám to dává zrcadlo, že věci nedotahujete do konce.',
};

const Home: NextPage<HomeServerProps> = ({ questions }) => {
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

export const getServerSideProps = async () => {
  try {
    // const response = await axiosInstance.get('api/main-layout?populate=*');
    const { questions } = await getQuestions();

    return {
      props: {
        // layout: { id: data.id, ...data.attributes },
        questions: questions,
      },
    };
  } catch (error) {
    return {
      props: {
        questions: [],
      },
    };
  }
};

export default Home;
