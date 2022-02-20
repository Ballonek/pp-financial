import { readAsync, writeAsync } from 'fs-jetpack';
import { NextApiRequest, NextApiResponse } from 'next';
import { Question } from '../../../components/types';
import Questions from '../../../api/models/question';
import { isAuth } from '../admin';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const questionsArray = await Questions.find();
        // const JSONdata: { questions: Question[] } = await readAsync('data/questions.json', 'json');

        // @ts-ignore
        const question = questionsArray[0].questions.find((ques) => ques.id === req.query.id);

        return res.status(200).json({ question });
      } catch (error) {
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

        const questionsArray = await Questions.find();
        // const JSONdata: { questions: Question[] } = await readAsync('data/questions.json', 'json');

        const queryId = req.query.id;

        if (queryId === 'new') {
          const newQuestion = {
            ...req.body,
            id: uuidv4(),
            order: questionsArray[0].questions.length,
          };

          const newQuestions = [...questionsArray[0].questions, newQuestion];

          await Questions.findByIdAndUpdate(questionsArray[0].id, { questions: newQuestions });
          // await writeAsync('data/questions.json', JSON.stringify({ questions: newQuestions }));

          const updatedQuestions = await Questions.find();

          // @ts-ignore
          const question = updatedQuestions[0].questions.find((ques) => ques.id === req.query.id);

          return res.status(200).json({ question });
        } else {
          // @ts-ignore
          const questions = questionsArray[0].questions.map((ques) => {
            if (queryId === ques.id) {
              return { ...req.body };
            } else return ques;
          });

          await Questions.findByIdAndUpdate(questionsArray[0].id, { questions: questions });
          // await writeAsync('data/questions.json', JSON.stringify({ questions: newQuestions }));

          const updatedQuestions = await Questions.find();

          // @ts-ignore
          const question = updatedQuestions[0].questions.find((ques) => ques.id === req.query.id);

          return res.status(200).json({ question });
        }
      } catch (error) {
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

      const questionsArray = await Questions.find();

      //const JSONdata: { questions: Question[] } = await readAsync('data/questions.json', 'json');

      const queryId = req.query.id;

      // @ts-ignore
      const newQuestions = questionsArray[0].questions.filter((que) => que.id !== queryId);

      await Questions.findByIdAndUpdate(questionsArray[0].id, { questions: newQuestions });

      const updatedQuestions = await Questions.find();

      // await writeAsync('data/questions.json', JSON.stringify({ questions: newQuestions }));
      return res.status(200).json({ questions: updatedQuestions[0].questions });
    default:
      return res.status(405).json({
        error: { message: 'Method not allowed' },
      });
  }
}
