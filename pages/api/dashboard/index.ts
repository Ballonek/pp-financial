import { NextApiRequest, NextApiResponse } from 'next';
import Dashboard from '../../../api/models/dashboard';
import dbConnect from '../../../api/db';
import NextCors from 'nextjs-cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  });
  try {
    await dbConnect();
  } catch (error) {
    console.log(error);
  }
  switch (req.method) {
    case 'GET': {
      try {
        console.log('ted');
        const dashboards = await Dashboard.find({});

        const dashboard = dashboards[0];
        return res.json(dashboard);
      } catch (error) {
        console.log({ error });
        return res.json(error);
      }
    }

    case 'PUT':
      const body = req.body;
      if (!body?.welcomeText && !body?.thanksText && !body?.thanksSubText) {
        return res.status(404).json({
          error: { message: 'No properties to update in body' },
        });
      }
      try {
        const dashboards = await Dashboard.find({});

        const dashboard = dashboards[0];

        if (body?.welcomeText || body?.welcomeText === '') {
          dashboard.welcomeText = body.welcomeText;
        }

        if (body?.thanksText || body?.thanksText === '') {
          dashboard.thanksText = body.thanksText;
        }

        if (body?.thanksSubText || body?.thanksSubText === '') {
          dashboard.thanksSubText = body.thanksSubText;
        }

        await Dashboard.updateOne({ id: dashboard.id }, dashboard);

        return res.json(dashboard);
      } catch (error) {
        console.log({ error });
        return res.status(404).json({
          error: { message: 'Nevyslo' },
        });
      }
    default:
      return res.status(405).json({
        error: { message: 'Method not allowed' },
      });
  }
}
