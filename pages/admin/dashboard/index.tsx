import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import Cookies from 'cookies';
import { axiosInstance } from '../../../code/constants';
import jscookie from 'js-cookie';
import { Grid, Typography } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { ChangeEvent, useState } from 'react';
import { useMutation } from 'react-query';
import { postBackgroundImage } from '../../../code/api';
import Image from 'next/image';
import { useRouter } from 'next/router';

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { mutate } = useMutation(postBackgroundImage);

  const onImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files && e.target.files[0]) {
      const imgToSend = e.target.files[0];

      mutate(
        { token: jscookie.get('token')!, img: imgToSend },
        {
          onSuccess: () => {
            router.reload();
          },
        }
      );
    }
  };

  return (
    <>
      <Head>
        <title>PP Financial - Admin dashboard</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Typography>Admin dashboard</Typography>
      <Grid>
        <div>
          <label htmlFor='backgroundImg'></label>
          <input id='backgroundImg' type='file' accept='image/*' onChange={onImageChange} />
        </div>
      </Grid>
      <div style={{ backgroundImage: `url(/api/dashboard/backgroundImg)`, backgroundSize: 'cover', height: 300, width: 500 }} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const cookies = new Cookies(req, res);

  const token = cookies.get('token');

  const { data } = await axiosInstance.get('/admin', { headers: { Authorization: `Bearer ${token}` } });

  if (!data) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Dashboard;
