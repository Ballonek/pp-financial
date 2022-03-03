import { NextPage } from 'next';
import Head from 'next/head';
import { getDashboard } from '../code/api';
import { defaultDashboard } from '../code/constants';
import { FormProps } from '../components/types';
import styles from '../styles/Home.module.css';

const Dekujeme: NextPage<{ dashboard: FormProps }> = ({ dashboard }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>PP Financial - Děkujeme</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main
        style={{ backgroundImage: `url(/api/dashboard/backgroundImg)`, backgroundPositionX: 'center' }}
        className={styles.mainThank}
      >
        <div className={styles.mainCover} />
        <div className={styles.contentThank}>
          <div className={styles.welcomeThank}>
            <h2 className={styles.welcomeText}>{dashboard?.thanksText}</h2>
            <h4 className={styles.welcomeText}>{dashboard?.thanksSubText}</h4>
          </div>
        </div>
      </main>
    </div>
  );
};

export const getServerSideProps = async () => {
  try {
    const response = await getDashboard();

    return {
      props: {
        dashboard: response.data,
      },
    };
  } catch (error) {
    return {
      props: {
        dashboard: defaultDashboard,
      },
    };
  }
};

export default Dekujeme;
