import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, Files, Fields } from 'formidable';
import sharp from 'sharp';
import Dashboard from '../../../api/models/dashboard';
import { readAsync, writeAsync } from 'fs-jetpack';
import { v4 as uuidv4 } from 'uuid';
import { getFileStream, uploadToAws } from '../../../api/aws';
import dbConnect from '../../../api/db';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
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

        const newFilename = uuidv4();
        //@ts-ignore
        await sharp(`data/${backgroundImgToSend.newFilename}`)
          .resize({ width: 1920, fit: 'cover' })
          .jpeg({ quality: 80 })
          //@ts-ignore
          .toFile(`data/${newFilename}`);

        const dashboards = await Dashboard.find({});

        const dashboard = dashboards[0];

        const imgKey = await uploadToAws(
          //@ts-ignore
          `data/${newFilename}`,
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
