
import type { NextApiRequest, NextApiResponse } from "next";
import S3 from "aws-sdk/clients/s3";
import { env } from "~/env.mjs";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

const s3 = new S3({
  apiVersion: "2006-03-01",
  accessKeyId: env.ACCESS_KEY,
  secretAccessKey: env.SECRET_KEY,
  region: env.REGION,
  signatureVersion: "v4",
});
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

try {
  const session= await getServerAuthSession({req, res}) 
  const userId= session?.user?.id
  const petId= req.query.petId

    // make entries to image table for the product images
   
  if (userId && typeof petId==='string') {
  const image = await prisma.image.create({
    data: {
      userId,
      petId,
    
    },})
  
    const Key = image.id;
  
    const s3Params = {
      Bucket: env.BUCKET_NAME,
      Key,
      Expires: 60,
  
    };
  
    const uploadUrl = await s3.getSignedUrlPromise("putObject", s3Params);
  
  
  
    res.status(200).json({
      uploadUrl,
      key: Key,
    });
  } return 
} catch (error) {
  console.log(error)
}
}