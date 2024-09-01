import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { createError, defineEventHandler, getQuery } from "h3";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  let { phoneNumber, name } = query;

  if (!phoneNumber || !name) {
    phoneNumber = 'talisman';
    name = 'card';
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing phoneNumber or name parameter'
    });
  }

  // Configure AWS S3
  const s3Client = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
  });

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Prefix: `images/${phoneNumber}_${name}_`, // This sets the prefix for our search
  };

  try {
    const command = new ListObjectsV2Command(params);
    const data = await s3Client.send(command);
    
    if (!data.Contents) {
      return []; // No matching files found
    }

    // Extract just the file names and return them
    const fileNames = data.Contents.map(file => file.Key.split('/').pop());
    console.log(fileNames);

    return fileNames;
  } catch (error) {
    console.error('Error listing SVGs:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to list SVGs'
    });
  }
});