import { S3Client, ListObjectsV2Command, type _Object } from "@aws-sdk/client-s3";
import { createError, defineEventHandler, getQuery } from "h3";

export async function getListOfCards(prefix: string = 'images/talisman_card_'): Promise<_Object[]> {
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
    Prefix: prefix,
  };

  try {
    const command = new ListObjectsV2Command(params);
    const data = await s3Client.send(command);
    
    if (!data.Contents) {
      return []; // No matching files found
    }

    return data.Contents;
  } catch (error) {
    console.error('Error listing SVGs:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to list SVGs'
    });
  }
}

export function extractUserDetailsFromData(data: _Object[]) {
  return data.map(file => {
    const parts = file.Key.split('_');
    return {phone: parts[2], name: parts[3]};
  });
}
export default defineEventHandler(async () => {
  const fileNames = extractUserDetailsFromData((await getListOfCards()))

  return fileNames;
});