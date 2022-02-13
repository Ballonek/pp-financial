import type { GetServerSideProps, NextPage } from 'next';
import Cookies from 'cookies';
import { axiosInstance } from '../../../../code/constants';
import { Button, ButtonGroup } from '@mui/material';
import { deleteQuestion, getQuestion, postQuestion, putQuestion } from '../../../../code/api';
import { Question, QuestionType } from '../../../../components/types';
import { FC, useEffect, useState } from 'react';
import { SelectForm } from '../../../../components/SelectForm';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import jscookie from 'js-cookie';
import { useRouter } from 'next/router';
import { AppSelect } from '../../../../components/AppSelect';
import { OpenForm } from '../../../../components/OpenForm';
import { ScaleForm } from '../../../../components/ScaleForm';
import { AppInput } from '../../../../components/AppInput';

type QuestionsServerProps = { question: Question | null };

const QuestionForm: FC<{ question: Question | null; questionType: QuestionType | null }> = ({ question, questionType }) => {
  switch (questionType) {
    case QuestionType.SELECT:
      return <SelectForm />;
    case QuestionType.SCALE:
      return <ScaleForm />;
    case QuestionType.OPEN:
      return <OpenForm />;

    default:
      return null;
  }
};

const Questions: NextPage<QuestionsServerProps> = ({ question }) => {
  //@ts-ignore
  const [questionType, setQuestionType] = useState<QuestionType | null>(question?.type);
  const form = useForm({
    defaultValues: question!,
  });
  const router = useRouter();
  const { isLoading: isCreateLoading, mutate: createQuestion } = useMutation(postQuestion);
  const { isLoading: isUpdateLoading, mutate: updateQuestion } = useMutation(putQuestion);
  const { isLoading: isRemoveLoading, mutate: removeQuestion } = useMutation(deleteQuestion);

  const { watch } = form;
  const type = watch('type');

  useEffect(() => {
    if (type) {
      setQuestionType(type);
    }
  }, [type]);

  const onSuccess = () => router.replace('/admin/dashboard/questions');

  const onDelete = () => {
    if (question?.id) {
      removeQuestion({ id: question.id, token: jscookie.get('token')! }, { onSuccess });
    }
  };

  const onSubmit = (values: Question) => {
    if (question?.id) {
      updateQuestion({ id: question.id, question: values, token: jscookie.get('token')! }, { onSuccess });
    } else {
      createQuestion({ question: values, token: jscookie.get('token')! }, { onSuccess });
    }
  };
  return (
    <FormProvider {...form}>
      <form style={{ width: 600, display: 'flex', flexDirection: 'column' }} onSubmit={form.handleSubmit(onSubmit)}>
        <AppSelect
          fullWidth
          name='type'
          label='Vyberte typ otázky'
          options={[
            { text: 'Možnosti', value: QuestionType.SELECT },
            { text: 'Otevřená', value: QuestionType.OPEN },
            { text: 'Stupnice', value: QuestionType.SCALE },
          ]}
          disabled={question !== null}
          sx={{ marginY: 1 }}
        />
        <AppInput sx={{ marginY: 1 }} label='Text otázky' name='text' disabled={!questionType} />
        <QuestionForm question={question} questionType={questionType} />
        <ButtonGroup fullWidth>
          <Button
            sx={{ marginY: 2 }}
            type='submit'
            variant='contained'
            disabled={isCreateLoading || isUpdateLoading || isRemoveLoading || !questionType}
          >
            Uložit
          </Button>
          <Button
            sx={{ marginY: 2 }}
            variant='contained'
            color='error'
            disabled={!question?.id || isRemoveLoading}
            onClick={onDelete}
          >
            Smazat otázku
          </Button>
        </ButtonGroup>
      </form>
    </FormProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res, params }) => {
  const cookies = new Cookies(req, res);

  const token = cookies.get('token');

  const { data: user } = await axiosInstance.get('admin', { headers: { Authorization: `Bearer ${token}` } });

  if (!user) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  const query = params!.id as string;

  if (query === 'new') {
    return {
      props: {
        question: null,
      },
    };
  }

  const { data: questionData } = await getQuestion(params!.id as string);

  if (!questionData?.question) {
    return {
      redirect: {
        destination: '/admin/dashboard/questions',
        permanent: false,
      },
    };
  }
  return {
    props: {
      question: questionData?.question,
    },
  };
};

export default Questions;
