import S3 from 'aws-sdk/clients/s3';
import { createReadStream, readFileSync } from 'fs';
import path from 'path';
import { v4 as uuid4 } from 'uuid';

const s3Config = {
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY || 'AKIA2NBTSPWJNN4LR6WH',
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY || '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',
  region: process.env.NEXT_PUBLIC_AWS_REGION || 'eu-central-1',
  params: {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET || 'ppfinancial-bucket',
  },
};

const s3 = new S3(s3Config);

export const uploadToAws = async (
  filePath: string,
  contentType: string,
  name: string,
  ext: string
): Promise<string | undefined> => {
  const fileContent = createReadStream(filePath);

  console.log({ bucket: s3Config.params.Bucket });
  const params: S3.PutObjectRequest = {
    Bucket: s3Config.params.Bucket,
    Key: `${name}-${uuid4()}.${ext}`,
    Body: fileContent,
    ContentType: contentType,
  };

  try {
    const url = await s3.upload(params).promise();
    return url.Key;
  } catch (error) {
    console.log({ error });
  }
};

export const getFileStream = (fileKey: string) => {
  console.log({ bucket: s3Config.params.Bucket });
  const downloadParams: S3.GetObjectRequest = {
    Key: fileKey,
    Bucket: s3Config.params.Bucket,
  };

  return s3.getObject(downloadParams).createReadStream();
};
