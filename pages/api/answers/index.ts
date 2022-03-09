import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../api/db';
import Answer from '../../../api/models/answer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await dbConnect();
  } catch (error) {
    console.log(error);
  }
  switch (req.method) {
    case 'POST':
      const newAnswer = new Answer({ answers: req.body, createdAt: new Date() });

      await newAnswer.save();

      return res.json({ answer: newAnswer });

    case 'GET':
      const answers = await Answer.find().sort({ createdAt: 'descending' });

      return res.json(answers);

    default:
      return res.status(405).json({
        error: { message: 'Method not allowed' },
      });
  }
}
