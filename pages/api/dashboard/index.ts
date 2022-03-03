import { NextApiRequest, NextApiResponse } from 'next';
import Dashboard from '../../../api/models/dashboard';
import dbConnect from '../../../api/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  switch (req.method) {
    case 'GET': {
      try {
        const dashboards = await Dashboard.find({});

        const dashboard = dashboards[0];
        return res.json(dashboard);
      } catch (error) {
        console.log(error);
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

        if (body?.welcomeText) {
          dashboard.welcomeText = body.welcomeText;
        }

        if (body?.thanksText) {
          dashboard.thanksText = body.thanksText;
        }

        if (body?.thanksSubText) {
          dashboard.thanksSubText = body.thanksSubText;
        }

        await Dashboard.updateOne({ id: dashboard.id }, dashboard);

        return res.json(dashboard);
      } catch (error) {
        console.log({ error });
        return res.json(error);
      }
    default:
      return res.status(405).json({
        error: { message: 'Method not allowed' },
      });
  }
}
