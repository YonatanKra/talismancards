import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { defineEventHandler, getQuery, createError, setHeader } from "h3";

// In-memory cache object
export const cache = {};

export async function getCard(fileName: string) {
  // Check if the result is already cached
  if (cache[fileName]) {
    return cache[fileName]; // Return cached result
  }

  const s3Client = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION,
  });

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `images/${fileName}`,
  };

  try {
    const command = new GetObjectCommand(params);
    const data = await s3Client.send(command);
    
    if (!data.Body) {
      throw new Error('No data received from S3');
    }
    
    const svgData = await data.Body.transformToString();

    // Cache the result
    cache[fileName] = svgData;

    // Return the SVG data
    return svgData;
  } catch (error) {
    console.error('Error retrieving SVG:', error, params);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve SVG'
    });
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const fileName = query.fileName;

  if (!fileName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing fileName parameter'
    });
  }

  // Call getCard to retrieve the SVG
  return getCard(fileName as string);
});