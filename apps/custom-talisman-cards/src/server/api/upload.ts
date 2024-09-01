import { S3 } from '@aws-sdk/client-s3';
import { fromIni } from '@aws-sdk/credential-provider-ini'; // Optional: Use if you want to load credentials from a config file
import { APIGatewayEvent, Context } from 'aws-lambda';

export default async function (req: APIGatewayEvent, res: Context) {
  if (req.method === 'POST') {
    const { imageData, fileName } = req.body;

    // Configure AWS S3
    const s3 = new S3({
      region: process.env.AWS_REGION,
      credentials: fromIni({ profile: 'default' }) // Optional: Load credentials from AWS config file
    });

    const buffer = Buffer.from(imageData.replace(/^data:image\/svg+xml;base64,/, ''), 'base64');

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `images/${fileName}`,
      Body: buffer,
      ContentType: 'image/svg+xml',
    };

    try {
      const data = await s3.putObject(params); // Use putObject for uploading
      res.status(200).json({ message: 'Upload successful', data });
    } catch (error) {
      console.error('Upload Error', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
