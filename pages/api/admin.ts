import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { readAsync } from 'fs-jetpack';

const secret = 'JWT_SECRET';

export const isAuth = async (token: string) => {
  const { user } = await readAsync('data/user.json', 'json');

  const validated = jwt.verify(token, secret);

  if (typeof validated === 'string') {
    return validated === user.id ? true : false;
  }

  return validated.id === user.id ? true : false;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      try {
        const { authorization } = req.headers;

        if (!authorization) {
          return res.status(401).json({
            error: { message: 'Not authorized' },
          });
        }

        const { user } = await readAsync('data/user.json', 'json');
        const token = authorization.replace('Bearer ', '');

        delete user.password;

        const isLogedin = await isAuth(token);

        return isLogedin
          ? res.status(200).json({ user })
          : res.status(401).json({
              error: { message: 'Not authorized' },
            });
      } catch (error) {
        return res.status(401).json({
          error: { message: 'Not authorized' },
        });
      }

    case 'POST': {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(401).json({
          error: { message: 'Not authorized' },
        });
      }

      const { user } = await readAsync('data/user.json', 'json');

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({
          error: { message: 'Not authorized' },
        });
      }

      delete user.password;

      return res.status(200).json({ user });
    }

    default:
      return res.status(405).json({
        error: { message: 'Method not allowed' },
      });
  }
}
