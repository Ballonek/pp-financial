import { readAsync, writeAsync } from 'fs-jetpack';
import { NextApiRequest, NextApiResponse } from 'next';
import { Question } from '../../../components/types';
import Questions from '../../../api/models/question';
import { isAuth } from '../admin';
import { v4 as uuidv4 } from 'uuid';
import dbConnect from '../../../api/db';
import Answer from '../../../api/models/answer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();
  } catch (error) {
    console.log(error);
  }

  switch (req.method) {
    case 'DELETE':
      console.log('TEDAFDFA');
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

      const queryId = req.query.id;
      console.log({ queryId });

      try {
        await Answer.deleteOne({ _id: queryId });
        return res.json({ ok: true });
      } catch (error) {
        console.log({ error });
      }

    default:
      return res.status(405).json({
        error: { message: 'Method not allowed' },
      });
  }
}
