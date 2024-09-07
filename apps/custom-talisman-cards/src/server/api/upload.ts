import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { defineEventHandler, readBody, setResponseStatus, assertMethod } from 'h3';

export default defineEventHandler(async (event) => {
  assertMethod(event, 'POST');
  const body = await readBody(event);
  
  const { imageData, fileName } = body;

    if (!imageData || !fileName) {
      setResponseStatus(event, 400, 'Missing required fields');
      return 'Missing required fields';
    }

    // Configure AWS S3
    const s3Client = new S3Client({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: process.env.AWS_REGION,
    });

    const buffer = Buffer.from(imageData);

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `images/${fileName}`,
      Body: buffer,
      ContentType: 'image/svg+xml',
    };

    try {
      const command = new PutObjectCommand(params);
      const data = await s3Client.send(command);
      setResponseStatus(event, 200, 'Upload successful');  
      return JSON.stringify({message: 'Upload successful', data});
    } catch (error) {
      console.error('Upload Error', error);
      setResponseStatus(event, 500, JSON.stringify({message: 'Upload failed', error }));
      return JSON.stringify({message: 'Upload failed', error });
    }
  }
);