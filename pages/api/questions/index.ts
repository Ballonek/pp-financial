// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { writeAsync, readAsync } from 'fs-jetpack';
import { Question, QuestionType } from '../../../components/types';
import { isAuth } from '../admin';

export const qQuestions: Question[] = [
  {
    type: QuestionType.SELECT,
    text: 'Máte maturitu?',
    order: 1,
    id: '1',
    answers: [
      { id: '1', text: 'ANO' },
      { id: '2', text: 'NE' },
    ],
  },
  { type: QuestionType.OPEN, text: 'Kolik vám je let?', order: 2, id: '2', answerType: 'number' },
  {
    type: QuestionType.OPEN,
    text: 'Co Vám říkají tyto výrazy: CFD, OCP, SmartStocks?',
    order: 3,
    id: '3',
    answerType: 'longString',
  },
  { type: QuestionType.SCALE, text: 'Nejvíce mě baví začínat nové obchody', order: 4, id: '4', scale: 10 },
  { type: QuestionType.SCALE, text: 'Jsem samostatný', order: 5, id: '5', scale: 10 },
  {
    type: QuestionType.SELECT,
    text: 'Jak dlouho pracuji v obchodě',
    order: 6,
    id: '6',
    answers: [
      { id: '3', text: '0 - 1 rok' },
      { id: '4', text: '1 - 3 roky' },
      { id: '5', text: '3 a více let' },
    ],
  },
  { type: QuestionType.SCALE, text: 'Je důležitá pro mě vysoká provize', order: 7, id: '7', scale: 10 },
  {
    type: QuestionType.OPEN,
    text: 'Zavoláte potenciálním klientovi a on vám řekne pošlete mi to na email jak byste zvládl tuhle námitku ?',
    order: 8,
    id: '8',
    answerType: 'longString',
  },
  {
    type: QuestionType.SCALE,
    text: 'Když mám kolem sebe tým který mě podpoří podávám lepší výsledky ?',
    order: 9,
    id: '9',
    scale: 10,
  },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const JSONdata = await readAsync('data/questions.json', 'json');

        return res.status(200).json({ questions: JSONdata.questions });
      } catch (error) {
        return res.status(200).json({ questions: [] });
      }

    case 'POST':
      try {
        const { authorization } = req.headers;

        if (!authorization) {
          return res.status(401).json({
            error: { message: 'Not authorized' },
          });
        }

        const token = authorization.replace('Bearer ', '');

        const isLogedin = await isAuth(token);

        if (!isLogedin) {
          return res.status(401).json({
            error: { message: 'Not authorized' },
          });
        }

        const questions: Question[] = req.body;

        const newQuestions = questions.map((question, idx) => ({ ...question, order: idx + 1 }));

        await writeAsync('data/questions.json', JSON.stringify({ questions: newQuestions }));

        const JSONdata = await readAsync('data/questions.json', 'json');

        return res.status(200).json({ questions: JSONdata.questions });
      } catch (error) {
        return res.status(500).json({
          error: { message: 'Something went wrong' },
        });
      }
    default:
      return res.status(405).json({
        error: { message: 'Method not allowed' },
      });
  }
}
