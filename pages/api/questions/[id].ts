import { readAsync, writeAsync } from 'fs-jetpack';
import { NextApiRequest, NextApiResponse } from 'next';
import { Question } from '../../../components/types';
import { isAuth } from '../admin';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const JSONdata: { questions: Question[] } = await readAsync('data/questions.json', 'json');

        const question = JSONdata.questions.find((ques) => ques.id === req.query.id);

        return res.status(200).json({ question });
      } catch (error) {
        console.log(error);
        return res.status(200).json({ question: null });
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

        const JSONdata: { questions: Question[] } = await readAsync('data/questions.json', 'json');

        const queryId = req.query.id;

        if (queryId === 'new') {
          const newQuestion = {
            ...req.body,
            id: uuidv4(),
            order: JSONdata.questions.length,
          };

          const newQuestions = [...JSONdata.questions, newQuestion];

          await writeAsync('data/questions.json', JSON.stringify({ questions: newQuestions }));

          return res.status(200).json({ question: newQuestions });
        } else {
          const questions = JSONdata.questions.map((ques) => {
            if (queryId === ques.id) {
              return { ...req.body };
            } else return ques;
          });

          await writeAsync('data/questions.json', JSON.stringify({ questions: questions }));

          return res.status(200).json({ question: questions.find((ques) => ques.id === req.query.id) });
        }
      } catch (error) {
        console.log(error);
        return res.status(200).json({ question: null });
      }

    case 'DELETE':
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

      const JSONdata: { questions: Question[] } = await readAsync('data/questions.json', 'json');

      const queryId = req.query.id;

      const newQuestions = JSONdata.questions.filter((que) => que.id !== queryId);

      await writeAsync('data/questions.json', JSON.stringify({ questions: newQuestions }));
      return res.status(200).json({ question: newQuestions });
    default:
      return res.status(405).json({
        error: { message: 'Method not allowed' },
      });
  }
}
