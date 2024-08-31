import AWS from 'aws-sdk';

export default async function (req, res) {
  if (req.method === 'POST') {
    const { imageData, fileName } = req.body;

    // Configure AWS S3
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });

    const buffer = Buffer.from(imageData.replace(/^data:image\/svg+xml;base64,/, ''), 'base64');

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `images/${fileName}`,
      Body: buffer,
      ContentType: 'image/svg+xml',
    };

    try {
      const data = await s3.upload(params).promise();
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
