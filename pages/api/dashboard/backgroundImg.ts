import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, Files, Fields } from 'formidable';
import sharp from 'sharp';
import Dashboard from '../../../api/models/dashboard';
import { readAsync } from 'fs-jetpack';
import { readFileSync } from 'fs';
import { getFileStream, uploadToAws } from '../../../api/aws';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET': {
      try {
        const dashboards = await Dashboard.find({});

        const dashboard = dashboards[0];

        const stream = getFileStream(dashboard.backgroundImg);

        return stream.pipe(res);
      } catch (error) {
        console.log(error);
      }
    }

    case 'POST':
      try {
        const body: { files: Files; fields: Fields } = await new Promise((resolve, reject) => {
          const form = new IncomingForm({ multiples: false, uploadDir: `data` });

          form.parse(req, (err, fields, files) => {
            if (err) {
              return reject(err);
            }
            return resolve({ fields, files });
          });
        });

        //@ts-ignore
        const backgroundImgToSend = body.files.backgroundImg;

        const dashboards = await Dashboard.find({});

        const dashboard = dashboards[0];

        const imgKey = await uploadToAws(
          //@ts-ignore
          `data/${backgroundImgToSend.newFilename}`,
          //@ts-ignore
          backgroundImgToSend.mimetype,
          'BackgroundImage',
          'png'
        );

        await Dashboard.findOneAndUpdate(dashboard._id, { backgroundImg: imgKey });

        const newDashboard = await Dashboard.find();

        return res.json({ dashboard: newDashboard[0] });
      } catch (error) {
        console.log({ error });
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
