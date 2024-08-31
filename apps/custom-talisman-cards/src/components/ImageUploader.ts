// src/services/ImageUploader.ts
import AWS from 'aws-sdk';

export class ImageUploader {
  private s3: AWS.S3;

  constructor() {
    // Initialize the S3 client
    this.s3 = new AWS.S3({
      accessKeyId: process.env.VUE_APP_AWS_ACCESS_KEY_ID, // Use environment variables for security
      secretAccessKey: process.env.VUE_APP_AWS_SECRET_ACCESS_KEY,
      region: process.env.VUE_APP_AWS_REGION,
    });
  }

  async uploadImage(imageData: string, fileName: string): Promise<AWS.S3.PutObjectOutput> {
    const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
    const params = {
      Bucket: process.env.VUE_APP_AWS_BUCKET_NAME, // Your S3 bucket name
      Key: `images/${fileName}`, // Unique file name
      Body: Buffer.from(base64Data, 'base64'),
      ContentEncoding: 'base64', // Required for base64
      ContentType: 'image/png', // Set the content type
    };

    try {
      const response = await this.s3.upload(params).promise();
      return response;
    } catch (error) {
      console.error('Upload Error', error);
      throw error; // Rethrow the error for handling in the component
    }
  }
}